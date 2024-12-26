import { Info } from '~/api/useLocation'

export type CargoMissionEdit = {
  loc: string
  directionId: string
  name: string
  missionTitleId: string
}
export type FormCargo = {
  disable: boolean
  titleId: string
  name: string
  region: string
  loc: string
  yaw: string
  load: string
  offload: string
}

export type CargoArea = {
  id: string
  areaId: string
  booker: string
  occupier: string
  info: Info
}

export type HasCargo = {
  hasCargo: boolean
  isAssign: boolean
  clickable: boolean
  border: string
  isShelfDisable: boolean
  isOccupy: boolean
}

export type WrapperType = {
  translateX: number
  translateY: number
  scale: number
  rotate: number
}
export type WrapperType2Type = {
  floors: number
  numOfCargo: number
} & WrapperType

export type EditColumn = {
  locationId: string
  level: number
}
