import { YawType } from '@renderer/api/useYaw'
import { FormInstance, Form, Input } from 'antd'
import { FC, useEffect } from 'react'

const YawForm: FC<{
  formYaw: FormInstance<unknown>
  yawDataSource: YawType
  selectYawId: string
}> = ({ formYaw, yawDataSource, selectYawId }) => {
  const yawData = yawDataSource?.filter((v) => v.id === selectYawId)[0]

  useEffect(() => {
    formYaw.setFieldValue('yaw', yawData?.yaw)
  }, [formYaw, yawData?.id, yawData?.yaw])

  return (
    <Form form={formYaw} labelCol={{ span: 6 }} autoComplete="off">
      <Form.Item label="yaw" name="yaw">
        <Input />
      </Form.Item>
    </Form>
  )
}

export default YawForm
