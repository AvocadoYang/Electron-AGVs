import React, { useState, memo, useEffect } from 'react';
import { Layout, Menu, message, Switch } from 'antd';
import useMap from '@renderer/api/useMap';
import UploadWarningModal from './UploadWarningModal';
import { useAtom, useSetAtom } from 'jotai';
import {
  EditLocationPanelSwitch,
  EditLocationListTableSwitch,
  isShowLocationTooltip,
  EditRoadPanelSwitch,
  QuickEditLocationPanelSwitch,
  RoadListTableSwitch,
  EditZoneSwitch,
  EditShelfPanelSwitch,
  EditShelfCategoryPanelSwitch,
  EditShelfYawPanelSwitch,
  EditPalletSwitch,
  showAllZonesSwitch,
  showZonesTableSwitch,
  isShowEditMission,
  isShowEditChargeMission,
  isShowEditCycleMission,
  isShowEditBeforeLeftChargeStationMission,
  isShowEditScheduleMission,
  isShowEditIdleMission,
  isShowEditTopicMission,
  isShowEditMissionTag,
  isShowEditChargeStationPosition,
  isShowEditWarningId,
  isShowEditBackup,
  isOpenUploadWarningIDModal
} from '@renderer/utils/siderGloble';
import {
  AimOutlined,
  NodeIndexOutlined,
  BorderOuterOutlined,
  GoldOutlined,
  DeploymentUnitOutlined,
  ScheduleOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';
import '../setting.css';
import { ToolBarItemType } from './siderElement';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';

export type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const { Sider: AntdSider } = Layout;

const Sider: React.FC<{
  setHasOpenTool: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setHasOpenTool }) => {
  const { data } = useMap();
  const queryClient = useQueryClient();

  const [openEditLocationPanel, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch); // 1-1
  const [quickEditLocationPanel, setQuickEditLocationPanel] = useAtom(QuickEditLocationPanelSwitch); // 1-2
  const [showAllLocationListTable, setShowAllLocationListTable] = useAtom(
    EditLocationListTableSwitch
  ); // 1-4

  const [openEditRoadPanel, setOpenEditRoadPanel] = useAtom(EditRoadPanelSwitch); // 2-1
  const [showAllRoadListTable, setShowAllRoadListTable] = useAtom(RoadListTableSwitch); // 2-2

  const [openEditZone, setOpenEditZone] = useAtom(EditZoneSwitch); // 3-1
  const [showAllZones, setShowAllZones] = useAtom(showAllZonesSwitch); // 3-2
  const [showZonesTable, setShowZonesTable] = useAtom(showZonesTableSwitch); // 3-3

  const [openEditShelfPanel, setOpenEditShelf] = useAtom(EditShelfPanelSwitch); //4-1
  const [openEditShelfCategory, setOpenEditShelfCategory] = useAtom(EditShelfCategoryPanelSwitch); //4-2
  const [openYawTable, setOpenYawTable] = useAtom(EditShelfYawPanelSwitch); //4-3
  const [openPalletTable, setOpenPalletTable] = useAtom(EditPalletSwitch); //4-4

  const [openMissionPanel, setOpenMissionPanel] = useAtom(isShowEditMission); // 5-1
  const [openChargeMissionPanel, setOpenChargeMissionPanel] = useAtom(isShowEditChargeMission); // 5-2
  const [openCycleMissionPanel, setOpenCycleMissionPanel] = useAtom(isShowEditCycleMission); // 5-3
  const [openBeforeLeftStationMissionPanel, setOpenBeforeLeftStationMissionPanel] = useAtom(
    isShowEditBeforeLeftChargeStationMission
  ); // 5-4
  const [openScheduleMissionPanel, setOpenScheduleMissionPanel] =
    useAtom(isShowEditScheduleMission); // 5-5
  const [openIdleMissionPanel, setOpenIdleMissionPanel] = useAtom(isShowEditIdleMission); // 5-6
  const [openTopicMissionPanel, setOpenTopicMissionPanel] = useAtom(isShowEditTopicMission); // 5-7

  const [openTagMissionPanel, setOpenTagMissionPanel] = useAtom(isShowEditMissionTag); // 6-1
  const [openEditChargeStationIconPanel, setOpenEditChargeStationIconPanel] = useAtom(
    isShowEditChargeStationPosition
  ); // 6-2

  const [openWarningId, setOpenWarningId] = useAtom(isShowEditWarningId); // 7-1
  const [OpenUploadWarningIDModal, setOpenUploadWarningIDModal] = useAtom(
    isOpenUploadWarningIDModal
  ); //7-2
  const [openBackup, setOpenBackup] = useAtom(isShowEditBackup); // 7-3

  const setShowLocationToolTip = useSetAtom(isShowLocationTooltip); //地點tooltip
  const [collapsed, setCollapsed] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const isOpen = [
      openEditLocationPanel,
      showAllLocationListTable,
      quickEditLocationPanel,
      openEditRoadPanel,
      showAllRoadListTable,
      openEditZone,
      showZonesTable,
      openEditShelfPanel,
      openEditShelfCategory,
      openYawTable,
      openPalletTable,
      openMissionPanel,
      openChargeMissionPanel,
      openCycleMissionPanel,
      openBeforeLeftStationMissionPanel,
      openScheduleMissionPanel,
      openIdleMissionPanel,
      openTopicMissionPanel,
      openTagMissionPanel,
      openEditChargeStationIconPanel,
      openWarningId,
      openBackup
    ].some((item) => item);

    setHasOpenTool(isOpen);
  }, [
    openEditLocationPanel,
    showAllLocationListTable,
    quickEditLocationPanel,
    openEditRoadPanel,
    showAllRoadListTable,
    openEditZone,
    showZonesTable,
    openEditShelfPanel,
    openEditShelfCategory,
    openYawTable,
    openPalletTable,
    openMissionPanel,
    openChargeMissionPanel,
    openCycleMissionPanel,
    openBeforeLeftStationMissionPanel,
    openScheduleMissionPanel,
    openIdleMissionPanel,
    openTopicMissionPanel,
    openTagMissionPanel,
    openEditChargeStationIconPanel,
    openWarningId,
    openBackup
  ]);

  const handleShowPanel = async (check: boolean, itemType: ToolBarItemType) => {
    if (!data) return;
    switch (itemType) {
      // === location ===
      case 'location_panel':
        setOpenEditLocationPanel(check);
        break;
      case 'quick_location_panel':
        setQuickEditLocationPanel(check);
        break;
      case 'location_list':
        setShowAllLocationListTable(check);
        setShowLocationToolTip(true);

        break;
      // ===================
      // === road ===
      case 'road_panel':
        setOpenEditRoadPanel(check);
        break;
      case 'show_roads_table':
        setShowAllRoadListTable(check);
        break;

      // ===================

      // === zone ===
      case 'edit_zone':
        setOpenEditZone(check);
        break;
      case 'show_zone_list':
        setShowAllZones(check);
        break;
      case 'show_zone_table':
        setShowZonesTable(check);
        break;
      // ===================
      // === shelves ===
      // === shelf ===

      case 'edit_shelve':
        await queryClient.refetchQueries({ queryKey: ['shelf'] });
        setOpenEditShelf(check);
        break;
      case 'edit_shelve_type':
        await queryClient.refetchQueries({ queryKey: ['all-shelf-category'] });
        setOpenEditShelfCategory(check);
        break;
      case 'edit_yaw':
        await queryClient.refetchQueries({ queryKey: ['yaw'] });
        setOpenYawTable(check);
        break;

      case 'edit_pallet':
        setOpenPalletTable(check);
        break;

      // ===================

      // ===================
      // === missions ===

      case 'edit_mission':
        setOpenMissionPanel(check);
        break;

      case 'charge_mission':
        setOpenChargeMissionPanel(check);
        break;

      case 'cycle_mission':
        setOpenCycleMissionPanel(check);
        break;

      case 'before_left_charge_station_task':
        setOpenBeforeLeftStationMissionPanel(check);
        break;

      case 'idle_mission':
        setOpenIdleMissionPanel(check);
        break;

      case 'schedule_mission':
        setOpenScheduleMissionPanel(check);
        break;

      case 'topic_mission':
        setOpenTopicMissionPanel(check);
        break;
      // ===================

      // ===================
      // === others ===
      // case 'edit_gauge':
      //   console.log('edit_gauge')
      //   break
      case 'edit_tag':
        setOpenTagMissionPanel(check);
        break;
      case 'edit_charge_station_icon_style':
        setOpenEditChargeStationIconPanel(check);
        break;
      // ===================
      // === file ===
      case 'warning_id':
        setOpenWarningId(check);
        break;
      case 'upload_warning_file':
        setOpenUploadWarningIDModal(check);
        break;
      case 'backup_file':
        setOpenBackup(check);
        break;
      //=======
    }
  };

  const toolItem: MenuItem[] = [
    getItem(t('toolbar.location.edit_locations'), '1', <AimOutlined className="location_icon" />, [
      getItem(
        t('toolbar.location.edit_locations'),
        '1-1',
        <Switch
          onChange={(checked) => handleShowPanel(checked, 'location_panel')}
          checked={openEditLocationPanel}
        />
      ),
      getItem(
        t('toolbar.location.quick_edit_locations'),
        '1-2',
        <Switch onChange={(checked) => handleShowPanel(checked, 'quick_location_panel')} />
      ),
      getItem(
        t('toolbar.location.show_locations_table'),
        '1-4',
        <Switch
          checked={showAllLocationListTable}
          onChange={(checked) => handleShowPanel(checked, 'location_list')}
        />
      )
    ]),
    getItem(t('toolbar.road.roads.roads'), '2', <NodeIndexOutlined className="road_icon" />, [
      getItem(
        t('toolbar.road.roads.edit_roads'),
        '2-1',
        <Switch
          onChange={(checked) => handleShowPanel(checked, 'road_panel')}
          checked={openEditRoadPanel}
        />
      ),
      getItem(
        t('toolbar.road.roads.show_roads_table'),
        '2-4',
        <Switch
          checked={showAllRoadListTable}
          onChange={(checked) => handleShowPanel(checked, 'show_roads_table')}
        />
      )
    ]),
    getItem(t('toolbar.zone.zones.zones'), '3', <BorderOuterOutlined className="zone_icon" />, [
      getItem(
        t('toolbar.zone.zones.edit_zone'),
        '3-1',
        <Switch onChange={(checked) => handleShowPanel(checked, 'edit_zone')} />
      ),
      getItem(
        t('toolbar.zone.zones.show_zone_list'),
        '3-2',
        <Switch
          defaultChecked={showAllZones}
          onChange={(checked) => handleShowPanel(checked, 'show_zone_list')}
        />
      ),
      getItem(
        t('toolbar.zone.zones.show_zone_table'),
        '3-3',
        <Switch
          defaultChecked={showZonesTable}
          onChange={(checked) => handleShowPanel(checked, 'show_zone_table')}
        />
      )
    ]),
    getItem(
      t('toolbar.shelve.shelves.shelves&pallet'),
      '4',
      <GoldOutlined className="shelve_icon" />,
      [
        getItem(
          t('toolbar.shelve.shelves.edit_shelve'),
          '4-1',
          <Switch
            checked={openEditShelfPanel}
            onChange={(checked) => handleShowPanel(checked, 'edit_shelve')}
          />
        ),
        getItem(
          t('toolbar.shelve.shelves.edit_shelve_type'),
          '4-2',
          <Switch
            checked={openEditShelfCategory}
            onChange={(checked) => handleShowPanel(checked, 'edit_shelve_type')}
          />
        ),
        getItem(
          t('toolbar.shelve.shelves.edit_yaw'),
          '4-3',
          <Switch
            checked={openYawTable}
            onChange={(checked) => handleShowPanel(checked, 'edit_yaw')}
          />
        ),
        getItem(
          t('toolbar.shelve.shelves.edit_pallet'),
          '4-4',
          <Switch
            checked={openPalletTable}
            onChange={(checked) => handleShowPanel(checked, 'edit_pallet')}
          />
        )
      ]
    ),
    getItem(t('toolbar.mission.mission'), '6', <ScheduleOutlined />, [
      getItem(
        t('toolbar.mission.edit_mission'),
        '5-1',
        <Switch
          checked={openMissionPanel}
          onChange={(checked) => handleShowPanel(checked, 'edit_mission')}
        />
      ),

      getItem(
        t('toolbar.mission.charge_mission'),
        '5-2',
        <Switch
          checked={openChargeMissionPanel}
          onChange={(checked) => handleShowPanel(checked, 'charge_mission')}
        />
      ),

      getItem(
        t('toolbar.mission.cycle_mission'),
        '5-3',
        <Switch
          onChange={(checked) => handleShowPanel(checked, 'cycle_mission')}
          checked={openCycleMissionPanel}
        />
      ),

      getItem(
        t('toolbar.mission.before_left_charge_station_mission'),
        '5-4',
        <Switch
          onChange={(checked) => handleShowPanel(checked, 'before_left_charge_station_task')}
          checked={openBeforeLeftStationMissionPanel}
        />
      ),

      getItem(
        t('toolbar.mission.schedule_mission'),
        '5-5',
        <Switch
          defaultChecked={false}
          onChange={(checked) => handleShowPanel(checked, 'schedule_mission')}
          checked={openScheduleMissionPanel}
        />
      ),

      getItem(
        t('toolbar.mission.idle_mission'),
        '5-6',
        <Switch
          checked={openIdleMissionPanel}
          onChange={(checked) => handleShowPanel(checked, 'idle_mission')}
        />
      ),

      getItem(
        t('toolbar.mission.topic_mission'),
        '5-7',
        <Switch
          checked={openTopicMissionPanel}
          onChange={(checked) => handleShowPanel(checked, 'topic_mission')}
        />
      )
    ]),
    getItem(t('toolbar.others.others'), '7', <DeploymentUnitOutlined />, [
      getItem(
        t('toolbar.others.edit_tag'),
        '6-1',
        <Switch
          checked={openTagMissionPanel}
          onChange={(checked) => handleShowPanel(checked, 'edit_tag')}
        />
      ),
      getItem(
        t('toolbar.others.edit_charge_station_icon_style'),
        '6-2',
        <Switch
          checked={openEditChargeStationIconPanel}
          onChange={(checked) => handleShowPanel(checked, 'edit_charge_station_icon_style')}
        />
      )
    ]),

    getItem(t('toolbar.file_setting.file_setting'), '8', <FileOutlined />, [
      getItem(
        t('toolbar.file_setting.warning_id'),
        '8-1',
        <Switch
          checked={openWarningId}
          onChange={(checked) => handleShowPanel(checked, 'warning_id')}
        />
      ),
      getItem(
        t('toolbar.file_setting.upload_warning_file'),
        '8-2',
        <Switch
          checked={OpenUploadWarningIDModal}
          onChange={(checked) => handleShowPanel(checked, 'upload_warning_file')}
        />
      ),
      getItem(
        t('toolbar.file_setting.backup_file'),
        '8-3',
        <Switch
          checked={openBackup}
          onChange={(checked) => handleShowPanel(checked, 'backup_file')}
        />
      ),
      getItem(t('toolbar.restart.restart'), '8-4')
    ])
  ];

  const [messageApi, contextHolders] = message.useMessage();
  const restartMutate = useMutation({
    mutationFn: () => {
      return client.post('api/setting/restart');
    },
    onSuccess: () => {
      void messageApi.success('success');
      queryClient.refetchQueries({ queryKey: ['map'] });
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const handleRestart = (keyPath: Array<string>) => {
    if (JSON.stringify(keyPath) !== '["8-3","8"]') return;
    restartMutate.mutate();

    setTimeout(() => {
      window.location.reload();
    }, 6000);
  };
  return (
    <>
      {contextHolders}
      <AntdSider
        collapsible
        width={230}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="setting-sider"
      >
        <Menu
          onClick={(e) => handleRestart(e.keyPath)}
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          items={toolItem}
          className="setting-sider-menu"
        />
      </AntdSider>

      {/**  -------- 錯誤表 --------  */}

      <UploadWarningModal></UploadWarningModal>
    </>
  );
};

export default memo(Sider);
