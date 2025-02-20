import { memo, useEffect, useState } from 'react'
import './form.css'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  ColorPicker,
  ConfigProvider,
  Form,
  FormInstance,
  Input,
  message,
  Select,
  SelectProps,
  Space,
  Tag,
  Modal,
  Checkbox
} from 'antd'
import FormHr from '../../utils/FormHr'
import { initialZoneValue } from './formInitValue'
import { openNotificationWithIcon } from '../../utils/notification'
import { TagSettingType, ZoneType } from '@renderer/utils/jotai'
import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useMap from '@renderer/api/useMap'
import { borderColor } from '../../utils/utils'
import useAmrName from '@renderer/api/useAmrName'

type TagRender = SelectProps['tagRender']

const zoneType: SelectProps['options'] = [
  { value: '減速區' },
  { value: '限高區' },
  { value: '禁止區' }
]

type Save_Zone = {
  name: string
  backgroundColor: string
  category: {
    tags: string[] | []
    forbidden_car: string[] | undefined | string
    speed_limit: number | undefined
    hight_limit: number | undefined
  }
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
  tagSettingForm: FormInstance<unknown>
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ attributes, listeners, sortableId, zonePanelForm, tagSettingForm }) => {
  const { t } = useTranslation()
  const { data } = useMap()
  const { data: allAmr = [] } = useAmrName()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isHint, setIsHint] = useState(false)
  const queryClient = useQueryClient()
  const [zoneTags, setZoneTags] = useState<string[] | undefined>([])
  const [allVehicleForbidden, setAllVehicleForbidden] = useState(false)
  const [notVehicleForbidden, setNotVehicleForbidden] = useState(false)
  const [messageApi, contextHolders] = message.useMessage()

  const AmrsID: SelectProps['options'] = allAmr.map((amr) => {
    return { value: amr.id }
  })

  const handleCancel = () => {
    setIsModalOpen(false)
  }
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
    if (!zonePanelForm.getFieldsValue() || (!tagSettingForm.getFieldsValue() && !zoneTags?.length))
      return
    const { name, color, category, startX, startY, endX, endY } =
      zonePanelForm.getFieldsValue() as ZoneType

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
      return
    }
    if (isHint) {
      openNotificationWithIcon(
        'warning',
        t('edit_zone_panel.waring.tag_not_yet_setting'),
        t('edit_zone_panel.waring.tag_not_yet_setting'),
        'bottomLeft'
      )
      return
    }

    const { speed_limit, hight_limit, forbidden } =
      tagSettingForm.getFieldsValue() as TagSettingType

    let rgba = `rgba(${color.metaColor.r}, ${color.metaColor.g}, ${color.metaColor.b} , 0.05)`
    const newZone = {
      name,
      backgroundColor: rgba,
      category: {
        tags: category || [],
        forbidden_car:
          (category?.includes('禁止區') && allVehicleForbidden) == true ? ['*'] : forbidden,
        speed_limit: category?.includes('減速區') ? Number(speed_limit) : undefined,
        hight_limit: category?.includes('限高區') ? Number(hight_limit) : undefined
      },
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
    setAllVehicleForbidden(false)
    setNotVehicleForbidden(false)
    setZoneTags([])
    zonePanelForm.resetFields()
    tagSettingForm.resetFields()
  }

  useEffect(() => {
    if (zoneTags?.length) {
      if (Object.keys(tagSettingForm.getFieldsValue(true) as {}).length === 0) {
        setIsHint(true)
        return
      }
      // console.log(tagSettingForm.getFieldsValue())
      if (
        zoneTags.includes('禁止區') &&
        !(
          tagSettingForm.getFieldValue('all_forbidden') ||
          tagSettingForm.getFieldValue('not_forbidden') ||
          (tagSettingForm.getFieldValue('forbidden') &&
            tagSettingForm.getFieldValue('forbidden').length)
        )
      ) {
        setIsHint(true)
        return
      }
      if (zoneTags.includes('減速區') && !tagSettingForm.getFieldValue('speed_limit')) {
        setIsHint(true)
        return
      }

      if (zoneTags.includes('限高區') && !tagSettingForm.getFieldValue('hight_limit')) {
        setIsHint(true)
        return
      }
    }
    setIsHint(false)
    return
  })

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
            <Input type="string" style={{ width: 150 }} placeholder="請輸入區域名稱" />
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
          <Form.Item
            label={t('edit_zone_panel.category')}
            name="category"
            style={{ marginBottom: `${zoneTags?.length ? '5px' : '20px'}` }}
          >
            <Select
              placeholder={'請選擇區域屬性'}
              mode="multiple"
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={zoneType}
              onChange={(tags) => setZoneTags(tags)}
            />
          </Form.Item>
          {zoneTags?.length ? (
            <Form.Item style={{ textAlign: 'right', marginBottom: `8px` }}>
              <Space>
                {isHint ? <p style={{ color: 'red' }}>{t('edit_zone_panel.hint')}</p> : <p>✅</p>}
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        defaultBorderColor: 'orange'
                      }
                    }
                  }}
                >
                  <Button onClick={() => setIsModalOpen(true)} size="small">
                    {t('edit_zone_panel.tag_setting')}
                  </Button>
                </ConfigProvider>
              </Space>
            </Form.Item>
          ) : (
            []
          )}
          <Form.Item label={t('edit_zone_panel.color')} name="color">
            <ColorPicker showText />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button onClick={save} type="primary">
              {t('edit_location_panel.save')}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        title={t('edit_zone_panel.tag_setting')}
        open={isModalOpen}
        maskClosable={false}
        onOk={handleCancel}
        getContainer={false}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: 'none' } }}
        mask={false}
        style={{ borderTop: `5px solid ${borderColor(sortableId)}`, borderRadius: '11px' }}
      >
        <Form layout="vertical" form={tagSettingForm} style={{ fontWeight: 'bold' }}>
          <hr style={{ border: '1px solid black', marginBottom: '8px' }}></hr>
          {zoneTags?.includes('減速區') ? (
            <Form.Item
              name="speed_limit"
              label={`${t('edit_zone_panel.highest_speed')}: (${t('edit_zone_panel.necessary')}) `}
            >
              <Input type="number" placeholder="請輸入最高速限" style={{ width: '50%' }} />
            </Form.Item>
          ) : (
            []
          )}
          {zoneTags?.includes('限高區') ? (
            <Form.Item
              name="hight_limit"
              label={`${t('edit_zone_panel.hight_limit')}: (${t('edit_zone_panel.necessary')})`}
            >
              <Input type="number" placeholder="請輸入高度限制" style={{ width: '50%' }} />
            </Form.Item>
          ) : (
            []
          )}
          {zoneTags?.includes('禁止區') ? (
            <>
              <Space>
                <Form.Item
                  name="all_forbidden"
                  valuePropName="checked"
                  // label={`${t('edit_zone_panel.all_vehicle_forbidden')}: `}
                  style={{ margin: '0' }}
                >
                  <Checkbox
                    checked={notVehicleForbidden}
                    disabled={allVehicleForbidden}
                    onChange={(e) => setNotVehicleForbidden(e.target.checked)}
                  >{`${t('edit_zone_panel.not_vehicle_forbidden')}`}</Checkbox>
                </Form.Item>
                <Form.Item
                  name="not_forbidden"
                  valuePropName="checked"
                  // label={`${t('edit_zone_panel.all_vehicle_forbidden')}: `}
                  style={{ margin: '0' }}
                >
                  <Checkbox
                    checked={allVehicleForbidden}
                    disabled={notVehicleForbidden}
                    onChange={(e) => setAllVehicleForbidden(e.target.checked)}
                  >{`${t('edit_zone_panel.all_vehicle_forbidden')}`}</Checkbox>
                </Form.Item>
              </Space>
              <Form.Item name="forbidden" label={`${t('edit_zone_panel.forbidden_vehicle')}: `}>
                <Select
                  placeholder={'請選擇限制進入車輛'}
                  disabled={allVehicleForbidden || notVehicleForbidden}
                  mode={'multiple'}
                  tagRender={tagRender}
                  style={{ width: '100%' }}
                  options={[...AmrsID]}
                />
              </Form.Item>
            </>
          ) : (
            []
          )}
        </Form>
      </Modal>
    </>
  )
}

export default memo(EditZonePanel)
