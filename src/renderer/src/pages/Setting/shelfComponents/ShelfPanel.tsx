/* eslint-disable no-void */
import { Card, Form, InputNumber, Select, message } from 'antd'
import { FC, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ShelfTable from './ShelfTable'
import useAllMissionTitles from '@renderer/api/useMissionTitle'
import useShelfCategory from '@renderer/api/useShelfCategory'
import useRegionName from '@renderer/api/useLocRegionName'
import useYaw from '@renderer/api/useYaw'
import { borderColor } from '../utils/utils'

const ShelfPanel: React.FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { data: misTitle } = useAllMissionTitles()
  const { data: allCategory } = useShelfCategory()
  const { data: yaw } = useYaw()
  const { data: regionName } = useRegionName()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  return (
    <>
      {contextHolder}
      <h3 className="drop_button_style" {...listeners} {...attributes}>
        {t('edit_road_panel.road_table')}
      </h3>

      <hr
        style={{
          marginTop: '1px',
          marginBottom: '10px',
          border: `4px solid ${borderColor(sortableId)}`
        }}
      ></hr>
      {/* <Form form={form} labelCol={{ span: 6 }} autoComplete="off">
        <Form.Item label={t('edit_shelf_panel.category')} name="category" style={{ width: 500 }}>
          <Select
            style={{ width: 200 }}
            disabled={selectedRowKeys.length === 0}
            options={allCategory?.map((v) => {
              return { value: v.id, label: v.name }
            })}
          />
        </Form.Item>

        <Form.Item label={t('edit_shelf_panel.load_mission')} name="load" style={{ width: 500 }}>
          <Select disabled={selectedRowKeys.length === 0} allowClear>
            {misTitle?.map((v) => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('edit_shelf_panel.offload_mission')}
          name="offload"
          style={{ width: 500 }}
        >
          <Select disabled={selectedRowKeys.length === 0} allowClear>
            {misTitle?.map((v) => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('edit_shelf_panel.yaw')} name="yaw" style={{ width: 500 }}>
          <Select disabled={selectedRowKeys.length === 0} allowClear>
            {yaw?.map((v) => (
              <Select.Option key={v.id} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('edit_shelf_panel.cargo_limit')}
          name="cargo_limit"
          style={{ width: 500 }}
        >
          <InputNumber disabled={selectedRowKeys.length === 0} />
        </Form.Item>

        <Form.Item
          label={t('edit_shelf_panel.region_name')}
          name="region-name"
          style={{ width: 500 }}
        >
          <Select
            disabled={selectedRowKeys.length === 0}
            options={regionName?.map((r) => {
              return {
                label: r?.name,
                value: r?.id
              }
            })}
          />
        </Form.Item>
      </Form> */}

      <ShelfTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
    </>
  )
}

export default ShelfPanel
