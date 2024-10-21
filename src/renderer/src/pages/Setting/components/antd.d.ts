export type ToolBarItemType =
  | 'locationPanel'
  | 'stored_location'
  | 'show_editLocation'
  | 'locationList'
  | 'roadPanel'
  | 'stored_roads'
  | 'show_edit_roads'
  | 'show_roads_table'
  | 'edit_zone'
  | 'show_zone_list'

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
