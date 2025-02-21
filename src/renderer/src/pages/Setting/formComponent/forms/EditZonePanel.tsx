import { memo } from 'react'
import './form.css'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  ColorPicker,
  Form,
  FormInstance,
  Input,
  message,
  Select,
  SelectProps,
  Space,
  Tag
} from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import FormHr from '../../utils/FormHr'
import { initialZoneValue } from './formInitValue'
import { openNotificationWithIcon } from '../../utils/notification'
import { ZoneType } from '@renderer/utils/jotai'
import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useMap from '@renderer/api/useMap'

type TagRender = SelectProps['tagRender']

const zoneType: SelectProps['options'] = [
  { value: '減速區' },
  { value: '加速區' },
  { value: '限高區' },
  { value: '禁止區' }
]

type Save_Zone = {
  name: string
  backgroundColor: string
  category: string[]
  startPoint: {
    startX: number
    startY: number
  }
  endPoint: {
    endX: number
    endY: number
  }
}

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <Tag
      color={'cyan'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  )
}

const EditZonePanel: React.FC<{
  zonePanelForm: FormInstance<unknown>
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ attributes, listeners, sortableId, zonePanelForm }) => {
  const { t } = useTranslation()
  const { data } = useMap()
  const queryClient = useQueryClient()
  const [messageApi, contextHolders] = message.useMessage()

  const saveZoneMutation = useMutation({
    mutationFn: (payload: Save_Zone) => {
      return client.post('api/setting/save-new-zone', payload)
    },
    onSuccess: () => {
      void messageApi.success('success')
      queryClient.refetchQueries({ queryKey: ['map'] })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const save = () => {
    if (!zonePanelForm.getFieldsValue()) return
    const { name, color, category, startX, startY, endX, endY } =
      zonePanelForm.getFieldsValue() as ZoneType
    console.log(color)
    if ((startX === endX && startY === endY) || !startX || !startY) {
      openNotificationWithIcon(
        'warning',
        t('edit_zone_panel.waring.invalid_frame'),
        t('edit_zone_panel.waring.invalid_frame'),
        'bottomLeft'
      )
      return
    }
    if (!name) {
      openNotificationWithIcon(
        'warning',
        t('edit_zone_panel.waring.name_empty_error'),
        t('edit_zone_panel.waring.name_empty_error'),
        'bottomLeft'
      )
      return
    }

    const exists = data!.zones.some((zone) => {
      return zone.name.trim() === name.trim()
    })

    if (exists) {
      openNotificationWithIcon(
        'warning',
        t('edit_zone_panel.waring.name_duplicated_error'),
        t('edit_zone_panel.waring.name_duplicated_error'),
        'bottomLeft'
      )
      return
    }
    if (!color) {
      openNotificationWithIcon(
        'warning',
        t('edit_zone_panel.waring.color_error'),
        t('edit_zone_panel.waring.color_error'),
        'bottomLeft'
      )
    }
    const rgba = `rgba(${color.metaColor.r}, ${color.metaColor.g}, ${color.metaColor.b} , 0.1)`

    const newZone = {
      name,
      backgroundColor: rgba,
      category: category || [],
      startPoint: {
        startX,
        startY
      },
      endPoint: {
        endX,
        endY
      }
    }

    saveZoneMutation.mutate(newZone)
    zonePanelForm.resetFields()
  }
  if (!data) return []
  return (
    <>
      {contextHolders}
      <div style={{ width: '23em' }}>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('sider_output_form_name.zonePanel')}
        </h3>
        <FormHr sortableId={sortableId}></FormHr>
        <Form
          layout="vertical"
          initialValues={initialZoneValue}
          form={zonePanelForm}
          style={{ fontWeight: 'bold' }}
        >
          <Form.Item label={t('edit_zone_panel.name')} name="name" style={{ marginBottom: 16 }}>
            <Input type="string" style={{ width: 150 }} />
          </Form.Item>
          <Space size={'large'} style={{ marginBottom: '15px', overflow: 'hidden' }}>
            <div>
              <Form.Item
                label={
                  <Badge key={'geekblue1'} color={'geekblue'} text={t('edit_zone_panel.start_x')} />
                }
                name="startX"
                style={{ marginBottom: 16 }}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label={<Badge key={'red1'} color={'red'} text={t('edit_zone_panel.end_x')} />}
                name="endX"
                style={{ marginBottom: 16 }}
              >
                <Input type="number" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={
                  <Badge key={'geekblue2'} color={'geekblue'} text={t('edit_zone_panel.start_y')} />
                }
                name="startY"
                style={{ marginBottom: 16 }}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label={<Badge key={'red2'} color={'red'} text={t('edit_zone_panel.end_y')} />}
                name="endY"
                style={{ marginBottom: 16 }}
              >
                <Input type="number" />
              </Form.Item>
            </div>
          </Space>
          <Form.Item label={t('edit_zone_panel.category')} name="category">
            <Select
              mode="multiple"
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={zoneType}
            />
          </Form.Item>
          <Form.Item label={t('edit_zone_panel.color')} name="color">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button icon={<SaveOutlined />} onClick={save} color="primary" variant="filled">
              {t('edit_location_panel.save')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default memo(EditZonePanel)
