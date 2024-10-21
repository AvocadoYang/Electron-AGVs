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
  | 'edit_shelve'
  | 'edit_shelve_type'
  | 'edit_yaw'
  | 'edit_pallet'
  | 'edit_gauge'
  | 'edit_tag'
  | 'edit_charge_station_icon_style'

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
