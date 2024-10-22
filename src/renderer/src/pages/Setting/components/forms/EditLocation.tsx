/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useRef, useState } from 'react'
import { LocationType } from '../antd'
import { useAtom } from 'jotai'
import { tempEditLocationList } from '@renderer/utils/gloable'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'
import { openNotificationWithIcon } from '../../utils.ts/notification'
import { useTranslation } from 'react-i18next'
import { CloseOutlined } from '@ant-design/icons'
import { Form, Input, Radio, Button, FormInstance, Checkbox } from 'antd'

const initialValue = {
  locationId: 0,
  areaType: 'Extra',
  rotation: 0,
  canRotate: false
}

const EditLocation: React.FC<{
  openEditLocationPanel: boolean
  setOpenEditLocationPanel: React.Dispatch<boolean>
  isMousePointStart: boolean
  setIsMousePointStart: React.Dispatch<boolean>
  locationPanelForm: FormInstance<unknown>
}> = ({
  openEditLocationPanel,
  setOpenEditLocationPanel,
  setIsMousePointStart,
  isMousePointStart,
  locationPanelForm
}) => {
  const [editingList, setEditingList] = useAtom(tempEditLocationList)
  const { t } = useTranslation()
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null)

  const savePose = () => {
    const payload = locationPanelForm.getFieldsValue() as LocationType
    const isNegative = payload.locationId <= 0

    const isDuplicateId = editingList.some((v) => {
      return v.locationId === Number(payload.locationId)
    })

    if (payload.x === undefined || payload.y === undefined) {
      openNotificationWithIcon(
        'warning',
        t('edit_location_panel.save_pose_notify.empty_value'),
        t('edit_location_panel.save_pose_notify.fill_in_value'),
        'bottomLeft'
      )
      return
    }

    if (isNegative) {
      openNotificationWithIcon(
        'warning',
        t('edit_location_panel.save_pose_notify.format_warn'),
        t('edit_location_panel.save_pose_notify.is_a_navigate'),
        'bottomLeft'
      )
      return
    }
    if (isDuplicateId) {
      openNotificationWithIcon(
        'warning',
        t('edit_location_panel.save_pose_notify.duplicate_id'),
        t('edit_location_panel.save_pose_notify.change_duplicate_id'),
        'bottomLeft'
      )
      return
    }

    const sanitizedPayload = {
      ...payload,
      locationId: Number(payload.locationId),
      rotation: Number(payload.rotation)
    }
    setEditingList([...editingList, sanitizedPayload])
  }

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    })
  }

  return (
    <>
      {openEditLocationPanel && (
        <Draggable bounds={bounds} nodeRef={draggleRef} onStart={onStart}>
          <div
            ref={draggleRef}
            style={{
              position: 'absolute',
              top: '10%',
              borderRadius: '10px',
              left: '10%',
              width: '15%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              padding: '10px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              cursor: 'move',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <CloseOutlined
                onClick={() => {
                  setIsMousePointStart(!isMousePointStart)
                  setOpenEditLocationPanel(false)
                }}
              />
            </div>
            <Form
              initialValues={initialValue}
              form={locationPanelForm as FormInstance<unknown>}
              style={{ paddingTop: '15px' }}
            >
              <Form.Item label="X" name="x" shouldUpdate required>
                <Input />
              </Form.Item>

              <Form.Item label="Y" name="y" shouldUpdate required>
                <Input />
              </Form.Item>

              <Form.Item
                label="θ"
                name="rotation"
                shouldUpdate
                hasFeedback
                validateDebounce={1000}
                rules={[
                  { required: true, message: '必填' },
                  { max: 360, message: '不可超過360' },
                  { min: -360, message: '不可小於-360' }
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item label="是否可旋轉" name="canRotate" valuePropName="checked" shouldUpdate>
                <Checkbox />
              </Form.Item>

              <Form.Item
                label="ID"
                name="locationId"
                shouldUpdate
                rules={[{ required: true, message: '必填' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item label="功能" name="areaType" shouldUpdate>
                <Radio.Group value="Extra">
                  <Radio value="Extra">{t('edit_location_panel.none')}</Radio>
                  <Radio value="充電區">{t('edit_location_panel.charge_station')}</Radio>
                  <Radio value="預派點">{t('edit_location_panel.prepare_spot')}</Radio>
                  <Radio value="存貨區">{t('edit_location_panel.shelve')}</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button onClick={savePose} type="primary">
                  {t('edit_location_panel.save')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Draggable>
      )}
    </>
  )
}

export default EditLocation
