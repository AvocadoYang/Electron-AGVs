export const formList = [
  // ===================
  // === location ===
  { key: 'location_panel' },
  { key: 'location_list' },
  { key: 'quick_location_panel' },
  // ===================
  // === road ===
  { key: 'road_panel' },
  { key: 'show_roads_table' },
  // ===================
  // === zone ===
  { key: 'edit_zone' },
  { key: 'show_zone_list' },

  // ===================
  // === shelf ===
  { key: 'edit_shelve' },
  { key: 'edit_shelve_type' },
  { key: 'edit_yaw' },
  { key: 'edit_pallet' },
  // ===================
  // === amr config ===
  { key: 'edit_amr_config' },
  { key: 'edit_amr_cargo_info' },
  // ===================
  // === mission ===
  { key: 'edit_mission' },
  { key: 'shelf_mission' },
  { key: 'charge_mission' },
  { key: 'cycle_mission' },
  { key: 'todo_dependent_on_return_id_task' },
  { key: 'before_left_charge_station_task' },
  { key: 'idle_mission' },
  { key: 'schedule_mission' },
  { key: 'idle_mission' },
  { key: 'topic_mission' },
  // ===================
  // === other ===
  { key: 'edit_tag' },
  { key: 'edit_charge_station_icon_style' },
  { key: 'edit_region_name' },
  // ===================
  // === config ===
  { key: 'warning_id' },
  { key: 'backup_file' }
] as const

export const toolbarState = formList.map((item) => ({ ...item }))

export type formListType = typeof formList
export type ToolBarItemType = (typeof formList)[number]['key']
export type ToolBarType = typeof toolbarState
