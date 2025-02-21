import {
  Badge,
  Button,
  Checkbox,
  ColorPicker,
  ConfigProvider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Space,
  Tag,
  Card
} from 'antd'
import { FC, memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ZoneTableData } from '../../antd'
import useAmrName from '@renderer/api/useAmrName'
import { borderColor } from '@renderer/pages/Setting/utils/utils'

const zoneType: SelectProps['options'] = [
  { value: '減速區' },
  { value: '限高區' },
  { value: '禁止區' }
]
type TagRender = SelectProps['tagRender']

const EditZoneTable: FC<{
  setEditingKey: React.Dispatch<React.SetStateAction<string | null>>
  editingKey: string
  oldData: ZoneTableData | null
  sortableId: string
}> = ({ setEditingKey, editingKey, oldData, sortableId }) => {
  const [editZoneForm] = Form.useForm()
  const [allVehicleForbidden, setAllVehicleForbidden] = useState(false)
  const [notVehicleForbidden, setNotVehicleForbidden] = useState(false)
  const [isHint, setIsHint] = useState(false)
  const [forbiddenParam, setForbiddenParam] = useState<string | null>(null)
  const [zoneTags, setZoneTags] = useState<string[] | undefined>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: allAmr = [] } = useAmrName()
  const { t } = useTranslation()

  const AmrsID: SelectProps['options'] = allAmr.map((amr) => {
    return { value: amr.id }
  })

  const save = () => {
    const data = editZoneForm.getFieldsValue()
    console.log(data)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
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

  useEffect(() => {
    if (zoneTags?.length) {
      if (
        zoneTags.includes('禁止區') &&
        !(
          editZoneForm.getFieldValue('all_forbidden') ||
          editZoneForm.getFieldValue('not_forbidden') ||
          (editZoneForm.getFieldValue('forbidden') &&
            editZoneForm.getFieldValue('forbidden').length)
        )
      ) {
        setIsHint(true)
        return
      }
      if (zoneTags.includes('減速區') && !editZoneForm.getFieldValue('speed_limit')) {
        setIsHint(true)
        return
      }

      if (zoneTags.includes('限高區') && !editZoneForm.getFieldValue('hight_limit')) {
        setIsHint(true)
        return
      }
    }
  })
  console.log(editZoneForm.getFieldsValue())
  useEffect(() => {
    if (!oldData) return
    setZoneTags(oldData.category)
    const forbiddenCar = oldData.tagSetting.forbidden_car
    if (!forbiddenCar) {
      setNotVehicleForbidden(true)
      editZoneForm.setFieldValue('not_forbidden', true)
    }
    if (forbiddenCar?.includes('*')) {
      setAllVehicleForbidden(true)
      editZoneForm.setFieldValue('all_forbidden', true)
    }
    editZoneForm.setFieldValue('name', oldData.name)
    editZoneForm.setFieldValue('color', oldData.backgroundColor)
    editZoneForm.setFieldValue('startX', oldData.startPoint.startX)
    editZoneForm.setFieldValue('startY', oldData.startPoint.startY)
    editZoneForm.setFieldValue('endX', oldData.endPoint.endX)
    editZoneForm.setFieldValue('endY', oldData.endPoint.endY)
    editZoneForm.setFieldValue('category', oldData.category)
    editZoneForm.setFieldValue('hight_limit', oldData.tagSetting.hight_limit)
    editZoneForm.setFieldValue('speed_limit', oldData.tagSetting.speed_limit)
    editZoneForm.setFieldValue('forbidden', oldData.tagSetting.forbidden_car)
  }, [])

  if (!oldData) return
  return (
    <>
      <Flex gap="middle" justify="flex-start" align="start" vertical>
        <Space size={'middle'}>
          <Button color="danger" variant="filled" onClick={() => setEditingKey(null)}>
            {t('utils.cancel')}
          </Button>
          <Button color="primary" variant="filled" onClick={() => save()}>
            {t('utils.save')}
          </Button>
        </Space>
        <Form layout="vertical" form={editZoneForm} style={{ fontWeight: 'bold' }}>
          <Form.Item label={t('edit_zone_panel.name')} name="name" style={{ marginBottom: 16 }}>
            <Input
              type="string"
              style={{ width: 150 }}
              placeholder="請輸入區域名稱"
              defaultValue={oldData.name}
            />
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
                <Input type="number" defaultValue={oldData.startPoint.startX} />
              </Form.Item>
              <Form.Item
                label={<Badge key={'red1'} color={'red'} text={t('edit_zone_panel.end_x')} />}
                name="endX"
                style={{ marginBottom: 16 }}
              >
                <Input type="number" defaultValue={oldData.endPoint.endX} />
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
                <Input type="number" defaultValue={oldData.startPoint.startY} />
              </Form.Item>

              <Form.Item
                label={<Badge key={'red2'} color={'red'} text={t('edit_zone_panel.end_y')} />}
                name="endY"
                style={{ marginBottom: 16 }}
              >
                <Input type="number" defaultValue={oldData.endPoint.endY} />
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
              defaultValue={oldData.category}
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={zoneType}
              onChange={(tags) => setZoneTags(tags)}
            />
          </Form.Item>
          {zoneTags?.length ? (
            <Form.Item style={{ textAlign: 'left', marginBottom: `8px` }}>
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
            <ColorPicker showText defaultValue={oldData.backgroundColor} />
          </Form.Item>

          <Modal
            title={t('edit_zone_panel.tag_setting')}
            open={isModalOpen}
            maskClosable={false}
            onOk={handleCancel}
            onCancel={handleCancel}
            cancelButtonProps={{ style: { display: 'none' } }}
            mask={false}
            style={{
              borderTop: `5px solid ${borderColor(sortableId)}`,
              borderRadius: '11px'
              // display: `${isModalOpen ? '' : 'none'}`
            }}
          >
            <hr style={{ border: '1px solid black', marginBottom: '8px' }}></hr>
            {zoneTags?.includes('減速區') ? (
              <Form.Item
                name="speed_limit"
                label={`${t('edit_zone_panel.highest_speed')}: (${t('edit_zone_panel.necessary')}) `}
              >
                <Input
                  type="number"
                  placeholder="請輸入最高速限"
                  style={{ width: '50%' }}
                  defaultValue={oldData.tagSetting.speed_limit || undefined}
                />
              </Form.Item>
            ) : (
              []
            )}
            {zoneTags?.includes('限高區') ? (
              <Form.Item
                name="hight_limit"
                label={`${t('edit_zone_panel.hight_limit')}: (${t('edit_zone_panel.necessary')})`}
              >
                <Input
                  type="number"
                  placeholder="請輸入高度限制"
                  style={{ width: '50%' }}
                  defaultValue={oldData.tagSetting.hight_limit || undefined}
                />
              </Form.Item>
            ) : (
              []
            )}
            {zoneTags?.includes('禁止區') ? (
              <>
                <Space>
                  <Form.Item name="not_forbidden" valuePropName="checked" style={{ margin: '0' }}>
                    <Checkbox
                      checked={notVehicleForbidden}
                      disabled={allVehicleForbidden}
                      defaultChecked={notVehicleForbidden}
                      onChange={(e) => setNotVehicleForbidden(e.target.checked)}
                    >{`${t('edit_zone_panel.not_vehicle_forbidden')}`}</Checkbox>
                  </Form.Item>
                  <Form.Item name="all_forbidden" valuePropName="checked" style={{ margin: '0' }}>
                    <Checkbox
                      checked={allVehicleForbidden}
                      disabled={notVehicleForbidden}
                      defaultChecked={allVehicleForbidden}
                      onChange={(e) => setAllVehicleForbidden(e.target.checked)}
                    >{`${t('edit_zone_panel.all_vehicle_forbidden')}`}</Checkbox>
                  </Form.Item>
                </Space>
                <Form.Item name="forbidden" label={`${t('edit_zone_panel.forbidden_vehicle')}: `}>
                  <Select
                    placeholder={'請選擇限制進入車輛'}
                    disabled={allVehicleForbidden || notVehicleForbidden}
                    defaultValue={oldData.tagSetting.forbidden_car || []}
                    mode={'multiple'}
                    tagRender={tagRender}
                    style={{ width: '100%' }}
                    options={AmrsID}
                  />
                </Form.Item>
              </>
            ) : (
              []
            )}
          </Modal>
        </Form>
      </Flex>
    </>
  )
}

export default memo(EditZoneTable)
