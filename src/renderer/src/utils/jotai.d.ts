export type LocationType = {
  locationId: number
  x: number
  y: number
  areaType: string
  rotation: number
  canRotate: boolean
}

export type Modify = {
  delete: string[]
  edit: string[]
  add: string[]
}
