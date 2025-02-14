import { FC, memo } from 'react'
import {
  AllLocationTable,
  EditLocationPanel,
  EditRoadPanel,
  EditZonePanel,
  QuickEditLocationPanel,
  RoadList
} from '../formComponent/forms'
import { Card, FormInstance } from 'antd'
import {
  EditLocationListTableSwitch,
  EditLocationPanelSwitch,
  EditRoadPanelSwitch,
  EditShelfCategoryPanelSwitch,
  EditShelfPanelSwitch,
  EditZoneSwitch,
  QuickEditLocationPanelSwitch,
  RoadListTableSwitch
} from '@renderer/utils/siderGloble'
import { useAtomValue } from 'jotai'
import { ToolBarItemType, ToolBarType } from './siderElement'
import { useSortable } from '@dnd-kit/sortable'
import cardStyle from '../utils/cardStyle'
import { ShelfPanel } from '../shelfComponents/editShelf'
import { ShelfCategoryPanel } from '../shelfComponents/category'

const SortableWrap: FC<{
  sortableId: ToolBarItemType
  locationPanelForm?: FormInstance<unknown>
  roadPanelForm?: FormInstance<unknown>
  zonePanelForm?: FormInstance<unknown>
}> = ({ sortableId, locationPanelForm, roadPanelForm, zonePanelForm }) => {
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
          case 'location_panel':
            return (
              <Card style={styles} ref={setNodeRef}>
                <EditLocationPanel
                  sortableId={sortableId}
                  locationPanelForm={locationPanelForm as FormInstance<unknown>}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          // 1-2 快速編輯點位的彈跳視窗
          case 'location_list':
            return (
              <Card style={styles} ref={setNodeRef}>
                <QuickEditLocationPanel
                  sortableId={sortableId}
                  locationPanelForm={locationPanelForm as FormInstance<unknown>}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'quick_location_panel':
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
          case 'road_panel':
            // 2-1 編輯路徑
            return (
              <Card style={styles} ref={setNodeRef}>
                <EditRoadPanel
                  roadPanelForm={roadPanelForm as FormInstance<unknown>}
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'show_roads_table':
            // 2-2 顯示路徑列表
            return (
              <Card style={styles} ref={setNodeRef}>
                <RoadList sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_zone':
            // 3-1 編輯區域
            return (
              <Card style={styles} ref={setNodeRef}>
                <EditZonePanel
                  zonePanelForm={zonePanelForm as FormInstance<unknown>}
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'edit_shelve':
            // 3-1 顯示編輯貨架
            return (
              <Card style={styles} ref={setNodeRef}>
                <ShelfPanel sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_shelve_type':
            // 3-2 顯示編輯類型
            return (
              <Card style={styles} ref={setNodeRef}>
                <ShelfCategoryPanel
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
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
  roadPanelForm: FormInstance<unknown>
  zonePanelForm: FormInstance<unknown>
  dataList: ToolBarType
}> = ({ locationPanelForm, dataList, roadPanelForm, zonePanelForm }) => {
  const showEditLocationPanel = useAtomValue(EditLocationPanelSwitch)
  const showQuickEditLocationPanel = useAtomValue(QuickEditLocationPanelSwitch)
  const showAllLocationListTable = useAtomValue(EditLocationListTableSwitch)
  const openEditRoadPanel = useAtomValue(EditRoadPanelSwitch)
  const showRoadList = useAtomValue(RoadListTableSwitch)
  const openZonePanel = useAtomValue(EditZoneSwitch)
  const openEditShelf = useAtomValue(EditShelfPanelSwitch)
  const openEditShelfCategory = useAtomValue(EditShelfCategoryPanelSwitch)

  return dataList.map((form) => {
    const { key: formKey } = form

    if (formKey === 'location_panel' && showEditLocationPanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'location_list' && showQuickEditLocationPanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'quick_location_panel' && showAllLocationListTable) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'road_panel' && openEditRoadPanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
          roadPanelForm={roadPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'show_roads_table' && showRoadList) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
          roadPanelForm={roadPanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'edit_zone' && openZonePanel) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          zonePanelForm={zonePanelForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'edit_shelve' && openEditShelf) {
      return (
        <SortableWrap
          sortableId={formKey}
          key={formKey}
          locationPanelForm={locationPanelForm}
        ></SortableWrap>
      )
    }

    if (formKey === 'edit_shelve_type' && openEditShelfCategory) {
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
