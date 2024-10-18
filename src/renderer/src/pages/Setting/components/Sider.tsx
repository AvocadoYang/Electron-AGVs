/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react'
import { Layout, Menu, Switch } from 'antd'
import { AimOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { ToolBarItemType } from './antd'
import { EditLocation } from './forms'
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

const Sider: React.FC = () => {
  const [openEditLocationPanel, setOpenEditLocationPanel] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const { t } = useTranslation()

  const handleShowPanel = async (check: boolean, itemType: ToolBarItemType) => {
    switch (itemType) {
      case 'locationPanel':
        setOpenEditLocationPanel(!openEditLocationPanel)
        break
      case 'stored_location':
        console.log('stored_location')
        break
      case 'show_editLocation':
        console.log('show_editLocation')
        break
      case 'locationList':
        console.log('locationList')
        break
    }
  }

  const toolItem: MenuItem[] = [
    getItem(t('toolbar.location.edit_locations'), '1', <AimOutlined />, [
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
          checked={false}
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
        <Menu mode="inline" style={{ height: '100%', borderRight: 0 }} items={toolItem} />
      </AntdSider>
      <EditLocation
        openEditLocationPanel={openEditLocationPanel}
        setOpenEditLocationPanel={setOpenEditLocationPanel}
      ></EditLocation>
      <EditLocation
        openEditLocationPanel={openEditLocationPanel}
        setOpenEditLocationPanel={setOpenEditLocationPanel}
      ></EditLocation>
    </>
  )
}

export default Sider
