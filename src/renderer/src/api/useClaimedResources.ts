import { io } from '@renderer/sockets/socketConnect'
import { useEffect, useState } from 'react'
import { from, fromEventPattern, share, switchMap } from 'rxjs'
import { array, object, string, ValidationError } from 'yup'

const schema = () =>
  object({
    locations: array(
      object({
        locationId: string().required(),
        amrId: string().required()
      }).required()
    ).required(),
    roads: array(
      object({
        roadId: string().required(),
        amrId: string().required()
      }).required()
    ).required()
  }).required()

const claimedResource$ = fromEventPattern(
  (next) => {
    io.on('claimed-resources', next)
    return next
  },
  (next) => {
    io.off('claimed-resources', next)
  }
).pipe(
  switchMap((msg) =>
    from(
      schema()
        .validate(msg, { stripUnknown: true })
        .catch((err: ValidationError) => {
          console.error(err.message)
          console.error('claimed-resources socket schema mismatch: ', err.value)
          return undefined
        })
    )
  ),
  share()
)

export const useClaimedRoads = () => {
  const [claimedRoads, setClaimedRoads] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const sub = claimedResource$.subscribe((info) => {
      setClaimedRoads(new Map(info?.roads.map(({ roadId, amrId }) => [roadId, amrId])))
    })

    return () => {
      sub.unsubscribe()
    }
  }, [])

  return claimedRoads
}

export const useClaimedLocations = () => {
  const [claimedLocations, setClaimedLocations] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const sub = claimedResource$.subscribe((info) => {
      setClaimedLocations(
        new Map(info?.locations.map(({ locationId, amrId }) => [locationId, amrId]))
      )
    })

    return () => {
      sub.unsubscribe()
    }
  }, [])

  return claimedLocations
}
