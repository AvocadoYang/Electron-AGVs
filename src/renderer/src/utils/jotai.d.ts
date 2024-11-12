export type LocationType = {
  locationId: number
  x: number
  y: number
  areaType: string
  rotation: number
  canRotate: boolean
}

export type RoadListType = {
  roadId: string
  validYawList: string | number[]
  x: string
  to: string
  x1: number
  y1: number
  x2: number
  y2: number
  roadType: 'oneWayRoad' | 'twoWayRoad'
  checkboxGroup?: string[]
  disabled: boolean
  limit: boolean
}

export type Modify = {
  delete: string[]
  edit: string[]
  add: string[]
}
