import { LocationType } from '@renderer/utils/jotai'
/** For All Location List Form */
export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  children: React.ReactNode
}

export type DataIndex = keyof LocationType

export type ZoneTableData = {
  id: string
  name: string
  category: string[]
  tagSetting: {
    forbidden_car: string[] | null
    hight_limit: number | null
    speed_limit: number | null
  }
  backgroundColor: string
  startPoint: { startX: number; startY: number }
  endPoint: { endX: number; endY: number }
}
