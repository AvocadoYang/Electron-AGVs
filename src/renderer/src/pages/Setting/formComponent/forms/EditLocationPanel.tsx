/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react'
import { LocationType } from '@renderer/utils/jotai'
import { useAtom } from 'jotai'
import './form.css'
import { EditLocationPanelSwitch } from '@renderer/utils/siderGloble'
import {  tempStoredLocation } from '@renderer/utils/gloable'
import { openNotificationWithIcon } from '../../utils/notification'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Input, Radio, Button, FormInstance, Checkbox, message, Card } from 'antd'
import { initialLocationFormValue } from './formInitValue'
import client  from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'

const EditLocationPanel: React.FC<{
  locationPanelForm: FormInstance<unknown>
  listeners: import("@dnd-kit/core/dist/hooks/utilities").SyntheticListenerMap | undefined;
}> = ({ locationPanelForm, listeners }) => {
  const [openEditLocationPanel, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [TempStoredLocation] = useAtom(tempStoredLocation)
  const queryClient = useQueryClient();
  const [messageApi, contextHolders] = message.useMessage()
  const { t } = useTranslation()

  const saveLocationMutation = useMutation({
    mutationFn: (payload: LocationType) => {
      return client.post('api/setting/save-edit-loc', payload);
    },
    onSuccess: () => {
      void messageApi.success('success');
      queryClient.refetchQueries({ queryKey: ['map'] });
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi),
  });


  const savePose = () => {
    const payload = locationPanelForm.getFieldsValue() as LocationType
    console.log(payload)
    const isNegative = payload.locationId <= 0

    const isDuplicateId = TempStoredLocation.some((v) => {
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
      rotation: Number(payload.rotation),
      x: Number(payload.x),
      y: Number(payload.y)
    }

    saveLocationMutation.mutate(sanitizedPayload);
  }

  return (
    <>
      {openEditLocationPanel && (
        <>
          {contextHolders}
          <div className='edit_location_panel_wrap' {...listeners}>
            <Form
              layout="vertical"
              initialValues={initialLocationFormValue}
              form={locationPanelForm}
            >
              <Form.Item label="X" name="x" style={{ marginBottom: 16 }} required>
                <Input />
              </Form.Item>

              <Form.Item label="Y" name="y" style={{ marginBottom: 16 }} required>
                <Input />
              </Form.Item>

              <Form.Item
                label="θ"
                name="rotation"
                style={{ marginBottom: 16 }}
                rules={[
                  { required: true, message: '必填' },
                  { max: 360, message: '不可超過360' },
                  { min: -360, message: '不可小於-360' },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
              label="是否可旋轉" name="canRotate" valuePropName="checked" shouldUpdate
                style={{ marginBottom: 16 }}
              >
                <Checkbox />
              </Form.Item>

              <Form.Item
                label="ID"
                name="locationId"
                style={{ marginBottom: 16 }}
                rules={[{ required: true, message: '必填' }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label={"功能"}
                name="areaType"
                style={{ marginBottom: 16 }}
              >
                <Radio.Group>
                <Radio value="Extra">{t('edit_location_panel.none')}</Radio>
                      <Radio value="充電區">{t('edit_location_panel.charge_station')}</Radio>
                      <Radio value="預派點">{t('edit_location_panel.prepare_spot')}</Radio>
                      <Radio value="待命區">{t('edit_location_panel.wait_side')}</Radio>
                      <Radio value="存貨區">{t('edit_location_panel.shelve')}</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item style={{ textAlign: 'center' }}>
                    <Button onClick={savePose} type="primary">
                      {t('edit_location_panel.save')}
                    </Button>
                  </Form.Item>
            </Form>
            </div>
        </>
      )}
    </>
  )
}

export default memo(EditLocationPanel)
