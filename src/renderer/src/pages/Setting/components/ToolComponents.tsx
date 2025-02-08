import { FC } from 'react'
import {
  AllLocationTable,
  EditLocationPanel,
  EditRoadPanel,
  RoadList
} from '../formComponent/forms'
import { FormInstance } from 'antd'

const ToolComponents: FC<{
  formKey: string
  locationPanelForm: FormInstance<unknown>
}> = ({ formKey, locationPanelForm }) => {
  switch (formKey) {
    case 'locationPanel':
      // 1-1 編輯點位的彈跳視窗
      return (
        <EditLocationPanel
          locationPanelForm={locationPanelForm}
          sortableId={formKey}
          key={formKey}
        />
      )
    case 'locationList':
      // 1-4 顯示地點列表
      return <AllLocationTable sortableId={formKey} key={formKey} />
    case 'roadPanel':
      // 1-4 顯示編輯路徑
      return <EditRoadPanel sortableId={formKey} key={formKey} />
    case 'show_roads_table':
      return <RoadList sortableId={formKey} key={formKey} />
    default:
      return null
  }
}
export default ToolComponents
