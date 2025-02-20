import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormHr from '../../utils/FormHr'
import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  TableColumnType,
  Tag,
  Typography
} from 'antd'
import { SearchOutlined, DeleteTwoTone } from '@ant-design/icons'
import useMap from '@renderer/api/useMap'
import { nanoid } from 'nanoid'
import { tagColor } from '../../utils/utils'
import { ZoneTableData } from './antd'

const ZoneTable: React.FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ listeners, attributes, sortableId }) => {
  const { data } = useMap()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const { t } = useTranslation()
  const [ZonePanelForm] = Form.useForm()

  const isEditing = (record: ZoneTableData) => record.id === editingKey

  //選擇要修改的區域列, 並且設定表單
  const edit = (record: Partial<ZoneTableData> & { id: string }) => {
    ZonePanelForm.setFieldValue('name', record.name)
    ZonePanelForm.setFieldValue('startX', Number(record.startPoint?.startX))
    ZonePanelForm.setFieldValue('startY', Number(record.startPoint?.startY))
    ZonePanelForm.setFieldValue('endX', Number(record.endPoint?.endX))
    ZonePanelForm.setFieldValue('endY', Number(record.endPoint?.endY))
    ZonePanelForm.setFieldValue('category', record.category)
    ZonePanelForm.setFieldValue('backgroundColor', record.backgroundColor)
    setEditingKey(record.id)
  }

  //取消所選取的區域列
  const cancel = () => {
    ZonePanelForm.resetFields()
    setEditingKey(null)
  }

  const columns = [
    {
      title: t('zone_table_form.zone_name'),
      dataIndex: 'name',
      key: 'name',
      editable: true,
      width: '16%'
    },
    {
      title: t('zone_table_form.start_point'),
      dataIndex: 'startPoint',
      key: 'startPoint',
      render: (data) => {
        return (
          <Flex justify="center" align="center" vertical>
            <p>{`X: ${(data.startX as number).toFixed(2)}`}</p>
            <p>{`Y: ${(data.startY as number).toFixed(2)}`}</p>
          </Flex>
        )
      },
      editable: true,
      width: '16%'
    },
    {
      title: t('zone_table_form.end_point'),
      dataIndex: 'endPoint',
      key: 'endPoint',
      editable: true,
      render: (data) => {
        return (
          <Flex justify="center" align="center" vertical>
            <p>{`X: ${(data.endX as number).toFixed(2)}`}</p>
            <p>{`Y: ${(data.endY as number).toFixed(2)}`}</p>
          </Flex>
        )
      },
      width: '16%'
    },
    {
      title: t('zone_table_form.zone_attr'),
      dataIndex: 'category',
      key: 'category',
      editable: true,
      render: (data) => {
        return (
          <Space wrap style={{ fontWeight: 'bold' }}>
            {(data as string[]).map((tag) => {
              return (
                <Tag color={tagColor(tag)} key={nanoid()}>
                  {tag}
                </Tag>
              )
            })}
          </Space>
        )
      },
      width: '23%'
    },
    {
      title: t('zone_table_form.zone_color'),
      dataIndex: 'backgroundColor',
      key: 'backgroundColor',
      render: (data) => {
        // console.log(data)
        return <ColorPicker disabled defaultValue={data}></ColorPicker>
      },
      editable: true,
      width: '6%'
    },
    {
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record: ZoneTableData) => {
        const editable = isEditing(record)
        return editable ? (
          <Flex vertical align="center" justify="space-between" gap={'middle'}>
            <Typography.Link
              onClick={() => {
                edit(record)
              }}
            >
              {t('utils.save')}
            </Typography.Link>
            <Typography.Link onClick={cancel}>{t('utils.cancel')}</Typography.Link>
          </Flex>
        ) : (
          <Flex vertical align="center" justify="space-between" gap={'middle'}>
            <Typography.Link
              disabled={editingKey !== null}
              onClick={() => {
                edit(record)
              }}
            >
              {t('utils.edit')}
            </Typography.Link>
            <Popconfirm
              title={t('utils.delete')}
              description={t('edit_location_panel.table_notify.are_you_sure')}
              onConfirm={() => console.log('confirm')}
              onCancel={() => console.log('cancel')}
              okText={t('utils.yes')}
              cancelText={t('utils.no')}
            >
              <DeleteTwoTone twoToneColor="#f30303" />
            </Popconfirm>
          </Flex>
        )
      },
      width: '12%'
    }
  ]

  if (!data) return
  return (
    <>
      <h3 className="drop_button_style" {...listeners} {...attributes}>
        {t('sider_output_form_name.zoneTable')}
      </h3>
      <FormHr sortableId={sortableId}></FormHr>
      <Flex gap="middle" justify="flex-start" align="start" vertical>
        <Button danger>{t('utils.delete')}</Button>

        <Form form={ZonePanelForm} component={false}>
          <Table
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys: React.Key[]) => {
                console.log(selectedRowKeys)
              }
            }}
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={data.zones}
          ></Table>
        </Form>
      </Flex>
    </>
  )
}

export default memo(ZoneTable)
