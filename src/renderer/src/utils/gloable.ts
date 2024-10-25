import { atom } from 'jotai'
import { LocationType, Modify } from './jotai'

export const startMousePoint = atom(false)

export const tempEditLocationList = atom<Array<LocationType>>([])

export const modifyLoc = atom<Modify>({
  delete: [],
  edit: [],
  add: []
})

export const modifyRoad = atom<Modify>({
  delete: [],
  edit: [],
  add: []
})

export const modifyZone = atom<Modify>({
  delete: [],
  edit: [],
  add: []
})

// record the version of map's points
export const sameVersion = atom(true)
