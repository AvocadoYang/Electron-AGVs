import { atom } from 'jotai'
import { LocationType, RoadListType, Modify } from './jotai'

export const tempEditLocationList = atom<Array<LocationType>>([])

export const tempEditAndStoredLocation = atom<Array<LocationType>>([])

export const tempEditRoads = atom<Array<RoadListType>>([])

export const tempEditAndStoredRoads = atom<Array<RoadListType>>([])

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

// control which ID of draggableLine can be use.
export const showBlockId = atom<string>('')

export const hoverLocation = atom<string>('')
