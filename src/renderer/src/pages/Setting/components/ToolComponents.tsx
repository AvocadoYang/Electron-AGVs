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
  EditPalletSwitch,
  EditRoadPanelSwitch,
  EditShelfCategoryPanelSwitch,
  EditShelfPanelSwitch,
  EditShelfYawPanelSwitch,
  EditZoneSwitch,
  isShowEditBeforeLeftChargeStationMission,
  isShowEditChargeMission,
  isShowEditCycleMission,
  isShowEditMission,
  QuickEditLocationPanelSwitch,
  RoadListTableSwitch
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
import EditMissionPanel from '../formComponent/forms/missionComponents/editMission/MissionPanel'
import { ChargePanel } from '../formComponent/forms/missionComponents/chargeMission'
import { CycleMIssionPanel } from '../formComponent/forms/missionComponents/cycleMission'
import { BeforeLeftChargeStationPanel } from '../formComponent/forms/missionComponents/beforLeftChargeStationMission'

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
              <Card style={styles} ref={setNodeRef}>
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
              <Card style={styles} ref={setNodeRef}>
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
              <Card style={styles} ref={setNodeRef}>
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
              <Card style={styles} ref={setNodeRef}>
                <FormCloseBtn sortableId={sortableId} />
                <RoadList sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_zone':
            // 3-1 編輯區域
            return (
              <Card style={styles} ref={setNodeRef}>
                <FormCloseBtn sortableId={sortableId} />
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
                <FormCloseBtn sortableId={sortableId} />
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
          case 'edit_yaw':
            // 3-3 顯示編輯類型
            return (
              <Card style={styles} ref={setNodeRef}>
                <YawPanel sortableId={sortableId} attributes={attributes} listeners={listeners} />
              </Card>
            )
          case 'edit_pallet':
            // 3-4 顯示編輯類型
            return (
              <Card style={styles} ref={setNodeRef}>
                <PalletTable
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )

          case 'edit_mission':
            // 5-1 顯示編輯任務
            return (
              <Card style={styles} ref={setNodeRef}>
                <EditMissionPanel
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )

          case 'charge_mission':
            // 5-2 顯示充電任務
            return (
              <Card style={styles} ref={setNodeRef}>
                <ChargePanel
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )

          case 'cycle_mission':
            // 5-2 顯示充電任務
            return (
              <Card style={styles} ref={setNodeRef}>
                <CycleMIssionPanel
                  sortableId={sortableId}
                  attributes={attributes}
                  listeners={listeners}
                />
              </Card>
            )

          case 'before_left_charge_station_task':
            // 5-3 顯示充電任務
            return (
              <Card style={styles} ref={setNodeRef}>
                <BeforeLeftChargeStationPanel
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
  const openEditShelfYaw = useAtomValue(EditShelfYawPanelSwitch)
  const openEditPalletTable = useAtomValue(EditPalletSwitch)
  const openMissionPanel = useAtomValue(isShowEditMission)
  const openChargePanel = useAtomValue(isShowEditChargeMission)
  const openCyclePanel = useAtomValue(isShowEditCycleMission)
  const openBLCSPanel = useAtomValue(isShowEditBeforeLeftChargeStationMission)

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

    if (formKey === 'edit_mission' && openMissionPanel) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }

    if (formKey === 'charge_mission' && openChargePanel) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }
    if (formKey === 'cycle_mission' && openCyclePanel) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }
    if (formKey === 'before_left_charge_station_task' && openBLCSPanel) {
      return <SortableWrap sortableId={formKey} key={formKey}></SortableWrap>
    }
    return []
  })
}
export default memo(ToolComponents)
