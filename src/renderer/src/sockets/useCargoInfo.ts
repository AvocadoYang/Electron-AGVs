/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { array, string, object, ValidationError, boolean } from 'yup'
import { from, fromEventPattern, map, share, switchMap, distinctUntilChanged } from 'rxjs'
import { useEffect, useState } from 'react'
import { io } from './socketConnect'

export type LayerType = {
  [level: number]: {
    levelName: string
    booked: boolean
    cargo_limit: number
    disable: boolean
    pallet: {
      id: string | null
      name: string | null
      color: string | null
    }
    cargo: {
      hasCargo: boolean
      name: string | null
    }
  }
}

export type Info = {
  areaId?: string
  name?: string | null
  isDropping?: boolean
  layer?: LayerType[]
}

const schema = () =>
  array(
    object({
      name: string().optional().nullable(),
      layer: array().optional(),
      areaId: string().optional(),
      isDropping: boolean().optional()
    }).required()
  ).required()

const profiles$ = fromEventPattern(
  (next) => {
    io.on('cargo-info', next)
    return next
  },
  (next) => {
    io.off('cargo-info', next)
  }
).pipe(
  switchMap((msg) =>
    from(
      schema()
        .validate(msg as unknown[], { stripUnknown: true })
        .catch((err: ValidationError) => {
          console.error(err.message)
          console.error('cargo-info socket schema mismatch: ', err.value)
          return undefined
        })
    )
  ),
  distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
  share()
)

const useCargoInfo = () => {
  const [cargoInfo, setCargoInfo] = useState<Info[]>()

  useEffect(() => {
    const subscription = profiles$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Avoid state update if data is identical
      )
      .subscribe((filteredData) => {
        if (filteredData) {
          setCargoInfo(filteredData)
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return cargoInfo
}

export default useCargoInfo
