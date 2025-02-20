/* eslint-disable no-void */
import client from '@renderer/api/axiosClient'
import useName from '@renderer/api/useAmrName'
import useAllMissionTitles from '@renderer/api/useMissionTitle'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Select, message } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type DataType = { amrId: string[]; missionId: string }

const BeforeLeftChargeStationForm: FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { data: missionTitle } = useAllMissionTitles()
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()
  const { data: name } = useName()
  const AmrOption = name?.map((v) => ({ value: v.id, label: v.id }))

  const addMutation = useMutation({
    mutationFn: (payload: DataType) => {
      return client.post(`api/setting/add-BLCS`, payload)
    },
    onSuccess: async () => {
      void messageApi.success(t('utils.success'))
      await queryClient.refetchQueries({
        queryKey: ['BLCS']
      })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const missionOptions = missionTitle?.map((v) => {
    return {
      value: v.id,
      label: v.name
    }
  })

  const handleAdd = () => {
    const payload = form.getFieldsValue() as DataType

    if (payload.amrId.length === 0 || !payload.missionId) {
      void messageApi.warning(t('mission.before_left_charge_station_mission.field_required'))
      return
    }

    addMutation.mutate(payload)
  }

  return (
    <>
      {contextHolder}
      <Form onFinish={handleAdd} form={form} labelCol={{ span: 6 }} autoComplete="off">
        <Form.Item label={t('mission.before_left_charge_station_mission.car')} name="amrId">
          <Select options={AmrOption} mode="multiple" />
        </Form.Item>
        <Form.Item label={t('mission.before_left_charge_station_mission.mission')} name="missionId">
          <Select options={missionOptions} />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {t('utils.add')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default BeforeLeftChargeStationForm
