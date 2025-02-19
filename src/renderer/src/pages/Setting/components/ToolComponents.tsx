import { FC, memo } from 'react'
import {
  AllLocationTable,
  EditLocationPanel,
  EditRoadPanel,
  EditZonePanel,
  QuickEditLocationPanel,
  RoadList,
  ZoneTable
} from '../formComponent/forms'
import { Card, FormInstance } from 'antd'
import {
  EditLocationListTableSwitch,
  EditLocationPanelSwitch,
  EditPalletSwitch,
  EditRoadPanelSwitch,
  EditShelfCategoryPanelSwitch,
  EditShelfPanelSwitch,
  EditShelfYawPanelSwitch,
  EditZoneSwitch,
  QuickEditLocationPanelSwitch,
  RoadListTableSwitch,
  showZonesTableSwitch
} from '@renderer/utils/siderGloble'
import { useAtomValue } from 'jotai'
import { ToolBarItemType, ToolBarType } from './siderElement'
import { useSortable } from '@dnd-kit/sortable'
import cardStyle from '../utils/cardStyle'
import { ShelfPanel } from '../formComponent/forms/shelfComponents/editShelf'
import { ShelfCategoryPanel } from '../formComponent/forms/shelfComponents/category'
import { YawPanel } from '../formComponent/forms/shelfComponents/yaw'
import { PalletTable } from '../formComponent/forms/shelfComponents/pallet'
import FormCloseBtn from '../utils/FormCloseBtn'

const SortableWrap: FC<{
  sortableId: ToolBarItemType
  locationPanelForm?: FormInstance<unknown>
  roadPanelForm?: FormInstance<unknown>
  zonePanelForm?: FormInstance<unknown>
  tagSettingForm?: FormInstance<unknown>
}> = ({ sortableId, locationPanelForm, roadPanelForm, zonePanelForm, tagSettingForm }) => {
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
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
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
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
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
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
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
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
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
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
                <RoadList sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_zone':
            // 3-1 編輯區域
            return (
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
                <EditZonePanel
                  zonePanelForm={zonePanelForm as FormInstance<unknown>}
                  tagSettingForm={tagSettingForm as FormInstance<unknown>}
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'show_zone_table':
            // 3-3 顯示區域表
            return (
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
                <ZoneTable
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                ></ZoneTable>
              </Card>
            )
          case 'edit_shelve':
            // 4-1 顯示編輯貨架
            return (
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <FormCloseBtn sortableId={sortableId} />
                <ShelfPanel sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_shelve_type':
            // 4-2 顯示編輯類型
            return (
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <ShelfCategoryPanel
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )
          case 'edit_yaw':
            // 4-3 顯示編輯類型
            return (
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <YawPanel sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_pallet':
            // 4-4 顯示編輯類型
            return (
              <Card style={styles} ref={setNodeRef} key={sortableId}>
                <PalletTable
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
  tagSettingForm: FormInstance<unknown>
  dataList: ToolBarType
}> = ({ locationPanelForm, dataList, roadPanelForm, zonePanelForm, tagSettingForm }) => {
  const showEditLocationPanel = useAtomValue(EditLocationPanelSwitch)
  const showQuickEditLocationPanel = useAtomValue(QuickEditLocationPanelSwitch)
  const showAllLocationListTable = useAtomValue(EditLocationListTableSwitch)
  const openEditRoadPanel = useAtomValue(EditRoadPanelSwitch)
  const showRoadList = useAtomValue(RoadListTableSwitch)
  const openZonePanel = useAtomValue(EditZoneSwitch)
  const openZoneTable = useAtomValue(showZonesTableSwitch)
  const openEditShelf = useAtomValue(EditShelfPanelSwitch)
  const openEditShelfCategory = useAtomValue(EditShelfCategoryPanelSwitch)
  const openEditShelfYaw = useAtomValue(EditShelfYawPanelSwitch)
  const openEditPalletTable = useAtomValue(EditPalletSwitch)

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
          tagSettingForm={tagSettingForm}
        ></SortableWrap>
      )
    }
    if (formKey === 'show_zone_table' && openZoneTable) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }
    if (formKey === 'edit_shelve' && openEditShelf) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }

    if (formKey === 'edit_shelve_type' && openEditShelfCategory) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }

    if (formKey === 'edit_yaw' && openEditShelfYaw) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }

    if (formKey === 'edit_pallet' && openEditPalletTable) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }
    return []
  })
}
export default memo(ToolComponents)
