import { FC, memo } from 'react'
import {
  AllLocationTable,
  EditLocationPanel,
  EditRoadPanel,
  QuickEditLocationPanel,
  RoadList
} from '../formComponent/forms'
import { Card, FormInstance } from 'antd'
import {
  EditLocationListTableSwitch,
  EditLocationPanelSwitch,
  EditRoadPanelSwitch,
  QuickEditLocationPanelSwitch,
  RoadListTableSwitch
} from '@renderer/utils/siderGloble'
import { useAtomValue } from 'jotai'
import { formListType } from './siderElement'
import { useSortable } from '@dnd-kit/sortable'
import cardStyle from '../utils/cardStyle'

const SortableWrap: FC<{ sortableId: string; locationPanelForm: FormInstance<unknown> }> = ({
  sortableId,
  locationPanelForm
}) => {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: sortableId, //這裡的id必須和SortableContext的item裡的id對應
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })
  const styles = cardStyle(transform, transition, sortableId)
  return (
    <>
      {(() => {
        switch (sortableId) {
          // 1-1 編輯點位的彈跳視窗
          case 'show_edit_location_panel':
            return (
              <Card style={styles} ref={setNodeRef}>
                <EditLocationPanel
                  sortableId={sortableId}
                  locationPanelForm={locationPanelForm}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          // 1-2 快速編輯點位的彈跳視窗
          case 'show_quick_edit_location_panel':
            return (
              <Card style={styles} ref={setNodeRef}>
                <QuickEditLocationPanel
                  sortableId={sortableId}
                  locationPanelForm={locationPanelForm}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'show_all_location_table':
            // 1-3 顯示地點列表
            return (
              <Card style={styles} ref={setNodeRef}>
                <AllLocationTable
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                ></AllLocationTable>
              </Card>
            )
          case 'show_edit_road_panel':
            // 2-1 顯示地點列表
            return (
              <Card style={styles} ref={setNodeRef}>
                <EditRoadPanel
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'show_all_roads_table':
            // 2-2 顯示地點列表
            return (
              <Card style={styles} ref={setNodeRef}>
                <RoadList sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          default:
            return null
        }
      })()}
    </>
  )
}

const ToolComponents: FC<{
  locationPanelForm: FormInstance<unknown>
  dataList: formListType
}> = ({ locationPanelForm, dataList }) => {
  const showEditLocationPanel = useAtomValue(EditLocationPanelSwitch)
  const showQuickEditLocationPanel = useAtomValue(QuickEditLocationPanelSwitch)
  const showAllLocationListTable = useAtomValue(EditLocationListTableSwitch)
  const openEditRoadPanel = useAtomValue(EditRoadPanelSwitch)
  const showRoadList = useAtomValue(RoadListTableSwitch)

  return dataList.map((form) => {
    const { key: formKey } = form
    if (formKey === 'show_edit_location_panel' && showEditLocationPanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'show_quick_edit_location_panel' && showQuickEditLocationPanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'show_all_location_table' && showAllLocationListTable) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'show_edit_road_panel' && openEditRoadPanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'show_all_roads_table' && showRoadList) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    return []
  })
}
export default memo(ToolComponents)
