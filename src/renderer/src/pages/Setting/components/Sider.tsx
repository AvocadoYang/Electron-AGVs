/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, memo } from 'react'
import { Layout, Menu, Switch, FormInstance } from 'antd'
import {
  AimOutlined,
  NodeIndexOutlined,
  BorderOuterOutlined,
  GoldOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ToolBarItemType } from './antd'
import { EditLocation } from '../forms'
import type { MenuProps } from 'antd'
import '../setting.css'

export type MenuItem = Required<MenuProps>['items'][number]

export function getItem(
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
  } as MenuItem
}

const { Sider: AntdSider } = Layout

const Sider: React.FC<{
  setIsMousePointStart: React.Dispatch<boolean>
  isMousePointStart: boolean
  forms: { locationPanelForm: FormInstance<unknown> }
  showStoredLocationControl: {
    setShowStoredLocation: React.Dispatch<boolean>
    showStoredLocation: boolean
  }
}> = ({ setIsMousePointStart, isMousePointStart, forms, showStoredLocationControl }) => {
  const [openEditLocationPanel, setOpenEditLocationPanel] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const { t } = useTranslation()

  const handleShowPanel = async (check: boolean, itemType: ToolBarItemType) => {
    switch (itemType) {
      // === location ===
      case 'locationPanel':
        setOpenEditLocationPanel(!openEditLocationPanel)
        setIsMousePointStart(!isMousePointStart)
        break
      case 'stored_location':
        showStoredLocationControl.setShowStoredLocation(
          !showStoredLocationControl.showStoredLocation
        )
        break
      case 'show_editLocation':
        console.log('show_editLocation')
        break
      case 'locationList':
        console.log('locationList')
        break
      // ===================
      // === road ===
      case 'roadPanel':
        console.log('roadPanel')
        break
      case 'stored_roads':
        console.log('stored_roads')
        break
      case 'show_edit_roads':
        console.log('show_edit_roads')
        break
      case 'show_roads_table':
        console.log('show_roads_table')
        break
      // ===================
      // === zone ===
      case 'edit_zone':
        console.log('edit_zone')
        break
      case 'show_zone_list':
        console.log('show_zone_list')
        break
      // ===================
      // === shelves ===
      case 'edit_shelve':
        console.log('edit_shelve')
        break
      case 'edit_shelve_type':
        console.log('edit_shelve_type')
        break
      case 'edit_yaw':
        console.log('edit_yaw')
        break
      case 'edit_pallet':
        console.log('edit_pallet')
        break
      // ===================
      // === others ===
      case 'edit_gauge':
        console.log('edit_gauge')
        break
      case 'edit_tag':
        console.log('edit_tag')
        break
      case 'edit_charge_station_icon_style':
        console.log('edit_charge_station_icon_style')
        break
      // ===================
    }
  }

  const toolItem: MenuItem[] = [
    getItem(t('toolbar.location.edit_locations'), '1', <AimOutlined className="location_icon" />, [
      getItem(
        t('toolbar.location.edit_locations'),
        '1-1',
        <Switch
          onChange={(checked) => handleShowPanel(checked, 'locationPanel')}
          checked={openEditLocationPanel}
        />
      ),
      getItem(
        t('toolbar.location.show_in_use_locations'),
        '1-2',
        <Switch
          defaultChecked
          onChange={(checked) => handleShowPanel(checked, 'stored_location')}
          checked={showStoredLocationControl.showStoredLocation}
        />
      ),
      getItem(
        t('toolbar.location.show_edit_locations'),
        '1-3',
        <Switch
          onClick={(checked) => handleShowPanel(checked, 'show_editLocation')}
          checked={false}
        />
      ),
      getItem(
        t('toolbar.location.show_locations_table'),
        '1-4',
        <Switch checked={false} onChange={(checked) => handleShowPanel(checked, 'locationList')} />
      )
    ]),
    getItem(t('toolbar.road.roads.roads'), '2', <NodeIndexOutlined className="road_icon" />, [
      getItem(
        t('toolbar.road.roads.edit_roads'),
        '2-1',
        <Switch onChange={(checked) => handleShowPanel(checked, 'roadPanel')} checked={false} />
      ),
      getItem(
        t('toolbar.road.roads.show_in_use_roads'),
        '2-2',
        <Switch
          defaultChecked
          onChange={(checked) => handleShowPanel(checked, 'stored_location')}
          checked={false}
        />
      ),
      getItem(
        t('toolbar.road.roads.show_edit_roads'),
        '2-3',
        <Switch
          onChange={(checked) => handleShowPanel(checked, 'show_edit_roads')}
          checked={false}
        />
      ),
      getItem(
        t('toolbar.road.roads.show_roads_table'),
        '2-4',
        <Switch
          checked={false}
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
          defaultChecked={false}
          onChange={(checked) => handleShowPanel(checked, 'show_zone_list')}
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
          <Switch onChange={(checked) => handleShowPanel(checked, 'edit_shelve')} />
        ),
        getItem(
          t('toolbar.shelve.shelves.edit_shelve_type'),
          '4-2',
          <Switch onChange={(checked) => handleShowPanel(checked, 'edit_shelve_type')} />
        ),
        getItem(
          t('toolbar.shelve.shelves.edit_yaw'),
          '4-3',
          <Switch onChange={(checked) => handleShowPanel(checked, 'edit_yaw')} />
        ),
        getItem(
          t('toolbar.shelve.shelves.edit_pallet'),
          '4-4',
          <Switch checked={false} onChange={(checked) => handleShowPanel(checked, 'edit_pallet')} />
        )
      ]
    ),
    getItem(t('toolbar.others.others'), '7', <DeploymentUnitOutlined />, [
      getItem(
        t('toolbar.others.edit_gauge'),
        '7-1',
        <Switch checked={false} onChange={(checked) => handleShowPanel(checked, 'edit_gauge')} />
      ),
      getItem(
        t('toolbar.others.edit_tag'),
        '7-2',
        <Switch checked={false} onChange={(checked) => handleShowPanel(checked, 'edit_tag')} />
      ),
      getItem(
        t('toolbar.others.edit_charge_station_icon_style'),
        '7-3',
        <Switch
          checked={false}
          onChange={(checked) => handleShowPanel(checked, 'edit_charge_station_icon_style')}
        />
      )
    ])
  ]

  return (
    // en=300, tw=230
    <>
      <AntdSider
        collapsible
        width={230}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="setting-sider"
      >
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
          items={toolItem}
          className="setting-sider-menu"
        />
      </AntdSider>

      <EditLocation
        openEditLocationPanel={openEditLocationPanel}
        setOpenEditLocationPanel={setOpenEditLocationPanel}
        setIsMousePointStart={setIsMousePointStart}
        isMousePointStart={isMousePointStart}
        locationPanelForm={forms.locationPanelForm}
      ></EditLocation>
    </>
  )
}

export default memo(Sider)
