import { WriteAction } from '~/configs/dispatcher'

export interface MissionListType {
  key: string
  name: string
  car_type: string
  category: string[]
}

// todo 待修相關使用 這是舊的
type Actions = {
  actions: DataType | undefined
}

export interface MissionAddType {
  id: string
  name: string

  createdAt: Date
  Car: {
    id: string
    name: string
    value: string
  }
  action: Array<Actions>
}

export interface EmitActions {
  operation: {
    type?: string
    control?: string[]
    wait: number
    is_define_id: string
    id: number
    is_define_yaw: number
    yaw: number
    tolerance: number
    lookahead: number
    roughly_pass: boolean
    from: number
    to: number
    hasCargoToProcess: boolean
    max_forward: number
    min_forward: number
    max_backward: number
    min_backward: number
    waitOtherAmr: string | null
    waitGenre: string | null
    auto_preparatory_point: boolean
  }
  io: {
    fork: {
      is_define_height: string
      height: number
      move?: number
      shift?: number
      tilt?: number
    }
    camera: {
      config?: number
      modify_dis?: number
    }
  }
}

export interface ActionTypes {
  id: string
  order: number
  disable?: boolean
  is_define_id: string
  locationId: number
  wait: number
  is_define_yaw: number
  yaw: number
  hasCargoToProcess: boolean
  waitOtherAmr: string | null
  waitGenre: string | null
  auto_preparatory_point: boolean
  is_define_height: string
  f_height: number
  hasWaitOther?: boolean
  titleId?: string | null
  genreId: string | null
  CarControl: {
    name: string
    genreName: string
  }
}

export interface DataType {
  order: number
  id: string
  types: string
  control: (string | undefined)[]
  wait: number
  is_define_id: string
  locationId: number

  is_define_yaw: number
  yaw: number
  tolerance: number
  lookahead: number
  roughly_pass: boolean
  from: number
  to: number
  max_speed: number
  hasCargoToProcess: boolean

  waitOtherAmr: string | null
  waitGenre: string | null
  auto_preparatory_point: boolean

  f_is_define_height: string
  f_height: number
  f_move: number
  f_shift: number
  f_tilt: number

  c_config: number
  c_modify_dis: number

  titleId: string
}

export type CarType = {
  id: string
  name: string
  value: string
}

export interface AllTitleMissionType {
  id: string
  name: string
  value: string
  Car: {
    id: string
    name: string
    value: string
  }
  actions: {
    is_define_id: string
    id: string
    order: number
    types: string
    control: string[]
    locationId: number

    wait: number
    is_define_yaw: number
    yaw: number
    tolerance: number
    lookahead: number
    roughly_pass: boolean
    from: number
    to: number
    max_speed: number
    hasCargoToProcess: boolean

    waitOtherAmr: string | null
    waitGenre: string | null
    auto_preparatory_point: boolean

    f_execute: boolean
    f_is_define_height: string
    f_height: number
    f_move: number
    f_shift: number
    f_tilt: number
    c_execute: boolean
    c_config: number
    c_modify_dis: number
    titleId: string
  }[]
}

export type MissionData = {
  titleId: string
  isInfinite: boolean
  amrId: Array<string> | undefined
  L1: number
  loc?: string
  times: number
  tasks: WriteAction[]
  [levelLoc: string]: number | string | boolean | Array<string> | WriteAction[] | undefined
}

interface CarControl {
  id: string
  name: string
  genreName: string
  from: number
  to: number
  control: string[]
  f_move: number
  f_shift: number
  f_tilt: number
  c_config: number
  c_modify_dis: number
  carTypeId: string
}

interface CarConfig {
  id: string
  tolerance: number
  lookahead: number
  roughly_pass: boolean
  max_forward: number
  min_forward: number
  max_backward: number
  min_backward: number
  carTypeId: string
}

interface Car {
  id: string
  name: string
  value: string
  CarConfig: CarConfig | null
}

interface Action {
  id: string
  order: number
  is_define_id: string
  locationId: number
  wait: number
  is_define_yaw: number
  yaw: number
  hasCargoToProcess: boolean

  waitOtherAmr: string | null
  waitGenre: string | null
  auto_preparatory_point: boolean

  titleId: string
  is_define_height: string
  f_height: number
  CarControl: CarControl
}

interface MissionTitleBridgeCategory {
  id: string
  missionTitleId: string
  categoryId: string
  Category: {
    id: string
    tagName: string
    color: string
  }
}

export interface TitleMission {
  id: string
  name: string
  MissionTitleBridgeCategory: MissionTitleBridgeCategory[] | null
  carId: string
  Car: Car | null
  actions?: Action[] | null
  // time: Date;
}

export enum YawGenre {
  CUSTOM,
  SELECT,
  CALCULATE_BY_AGV_AND_SHELF_ANGLE
}
