/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react'
import { LocationType } from '@renderer/utils/jotai'
import { modifyLoc as Loc } from '@renderer/utils/gloable'
import { useAtom } from 'jotai'
import { Modify } from '@renderer/utils/jotai'
import { EditLocationPanelSwitch } from '@renderer/utils/siderGloble'
import { tempEditLocationList, tempEditAndStoredLocation } from '@renderer/utils/gloable'
import DraggableWindow from './DraggableWindow'
import { openNotificationWithIcon } from '../utils/notification'
import { useTranslation } from 'react-i18next'
import { CloseOutlined } from '@ant-design/icons'
import { Form, Input, Radio, Button, FormInstance, Checkbox } from 'antd'
import { initialLocationFormValue } from './formInitValue'

const EditLocationPanel: React.FC<{
  locationPanelForm: FormInstance<unknown>
}> = ({ locationPanelForm }) => {
  const [TempEditLocationList, setTempEditLocationList] = useAtom(tempEditLocationList)
  const [openEditLocationPanel, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [TempEditAndStoredLocation] = useAtom(tempEditAndStoredLocation)
  const [modifyLoc, setModifyLoc] = useAtom(Loc)
  const { t } = useTranslation()

  const addModifyHandler = (id: string) => {
    const staleModify = { ...modifyLoc }

    const addList = [...staleModify.add, id]

    const editList = [...staleModify.edit].filter((d) => d !== id)

    const deleteList = [...staleModify.delete]

    const newModify: Modify = {
      add: [...new Set(addList)] as string[],
      edit: editList,
      delete: deleteList
    }

    setModifyLoc(newModify)
  }

  const savePose = () => {
    const payload = locationPanelForm.getFieldsValue() as LocationType
    const isNegative = payload.locationId <= 0

    const isDuplicateId = TempEditAndStoredLocation.some((v) => {
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
    addModifyHandler(sanitizedPayload.locationId.toString())
    setTempEditLocationList([...TempEditLocationList, sanitizedPayload])
  }

  return (
    <>
      {openEditLocationPanel && (
        <DraggableWindow>
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
                setOpenEditLocationPanel(false)
              }}
            />
          </div>
          <Form
            initialValues={initialLocationFormValue}
            form={locationPanelForm}
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

            <Form.Item label="是否可旋轉" name="canRotate" valuePropName="checked" shouldUpdate >
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

            <Form.Item style={{ textAlign: 'center'}}>
              <Button onClick={savePose} type="primary">
                {t('edit_location_panel.save')}
              </Button>
            </Form.Item>
          </Form>
        </DraggableWindow>
      )}
    </>
  )
}

export default memo(EditLocationPanel)
