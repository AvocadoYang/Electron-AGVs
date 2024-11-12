import { LocationType } from "@renderer/utils/jotai"
/** For All Location List Form */
export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  children: React.ReactNode
}

export type DataIndex = keyof LocationType
