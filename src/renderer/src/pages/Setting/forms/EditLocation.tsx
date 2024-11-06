/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, memo } from 'react'
import { LocationType } from '@renderer/utils/jotai'
import { modifyLoc as Loc, modifyRoad as Road, modifyZone as Zone } from '@renderer/utils/gloable'
import { useAtom } from 'jotai'
import { Modify } from '@renderer/utils/jotai'
import { EditLocationPanelSwitch } from '@renderer/utils/siderGloble'
import { tempEditLocationList } from '@renderer/utils/gloable'
import DraggableWindow from './DraggableWindow'
import { openNotificationWithIcon } from '../utils/notification'
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
  isMousePointStart: boolean
  setIsMousePointStart: React.Dispatch<boolean>
  locationPanelForm: FormInstance<unknown>
  // addModifyHandler: (id: string, genre: 'loc' | 'road' | 'zone') => void
}> = ({ setIsMousePointStart, isMousePointStart, locationPanelForm }) => {
  const [editingList, setEditingList] = useAtom(tempEditLocationList)
  const [openEditLocationPanel, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [modifyLoc, setModifyLoc] = useAtom(Loc)
  const [modifyRoad, setModifyRoad] = useAtom(Road)
  const [modifyZone, setModifyZone] = useAtom(Zone)
  const { t } = useTranslation()

  const addModifyHandler = useCallback(
    (id: string, genre: 'loc' | 'road' | 'zone') => {
      let staleModify = { ...modifyLoc }

      if (genre === 'road') staleModify = { ...modifyRoad }
      if (genre === 'zone') staleModify = { ...modifyZone }

      const addList = [...staleModify.add, id]

      const editList = [...staleModify.edit].filter((d) => d !== id)

      const deleteList = [...staleModify.delete]

      const newModify: Modify = {
        add: [...new Set(addList)] as string[],
        edit: editList,
        delete: deleteList
      }

      if (genre === 'loc') {
        setModifyLoc(newModify)
      }

      if (genre === 'road') {
        setModifyRoad(newModify)
      }

      if (genre === 'zone') {
        setModifyZone(newModify)
      }
    },
    [modifyLoc, modifyRoad, modifyZone]
  )

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
    addModifyHandler(sanitizedPayload.locationId.toString(), 'loc')
    setEditingList([...editingList, sanitizedPayload])
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
        </DraggableWindow>
      )}
    </>
  )
}

export default memo(EditLocation)
