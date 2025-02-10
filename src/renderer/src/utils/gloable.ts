import { atom } from 'jotai'
import { LocationType } from './jotai'

// record the version of map's points
export const sameVersion = atom(true)

// control which ID of draggableLine can be use.
export const showBlockId = atom<string>('')

export const hoverLocation = atom<string>('')

export const hoverRoad = atom<string>('')

export const mousePoint_X = atom<number>(-5) // MousePoint 編輯點位小紅點
export const mousePoint_Y = atom<number>(-5) // MousePoint 編輯點位小紅點

export const locationXForQuickEditLocationPanel = atom<number>(0)
export const locationYForQuickEditLocationPanel = atom<number>(0)

export const TempStoredLocationsForQuickEditPanel = atom<LocationType[]>([])
