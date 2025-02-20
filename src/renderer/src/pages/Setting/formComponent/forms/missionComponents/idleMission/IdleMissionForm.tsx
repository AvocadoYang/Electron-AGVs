import client from '@renderer/api/axiosClient'
import useName from '@renderer/api/useAmrName'
import useAllMissionTitles from '@renderer/api/useMissionTitle'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, InputNumber, message, Select } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { array, object, string } from 'yup'

const Wrapper = styled.div`
  background: white;
  width: 100%;
  max-height: 70vh;
  overflow-y: scroll;
  padding: 1em;
`

type SubmitPayload = {
  amrId: string[]
  missionId: string
  preventLocation: string[] | null
  idle_min: number
}

const getIdleSelect = async () => {
  const { data } = await client.get<unknown>('api/setting/idle-task-loc-selection')

  const schema = () =>
    array(
      object({
        label: string().optional(),
        value: string().optional()
      })
    ).optional()

  return schema().validate(data, { stripUnknown: true })
}

const IdleMissionForm: FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { data: name } = useName()
  const { data: missionTitle } = useAllMissionTitles()
  const [messageApi, contextHolder] = message.useMessage()
  const { data: idleLocSelect, isLoading } = useQuery(['idle-task-selection'], getIdleSelect)
  const queryClient = useQueryClient()

  const AmrOption = name?.map((v) => ({ value: v.id, label: v.id }))

  const missionOptions = missionTitle?.map((v) => {
    return {
      value: v.id,
      label: v.name
    }
  })

  const setMissionMutation = useMutation({
    mutationFn: (payload: SubmitPayload) => {
      return client.post('api/setting/add-idle-task', payload)
    },
    onSuccess: async () => {
      void messageApi.success(t('utils.success'))
      await queryClient.refetchQueries({
        queryKey: ['idle-task']
      })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const submit = () => {
    const payload = form.getFieldsValue() as SubmitPayload

    if (payload.amrId.length === 0) {
      messageApi.warning('amrId少填資料')
      return
    }

    if (payload.idle_min < 3) {
      messageApi.warning('不可少於3分鐘')
      return
    }

    setMissionMutation.mutate(payload)
  }

  return (
    <Wrapper>
      {contextHolder}
      <Form form={form} title="設定依照車輛回傳的id來做任務">
        <Form.Item label={t('mission.idle_mission.car')} name="amrId">
          <Select mode="multiple" options={AmrOption} />
        </Form.Item>

        <Form.Item label={t('mission.idle_mission.idle_min')} name="idle_min">
          <InputNumber min={3} />
        </Form.Item>

        <Form.Item label={t('mission.idle_mission.forbidden')} name="preventLocation">
          <Select mode="multiple" options={idleLocSelect} loading={isLoading} />
        </Form.Item>

        <Form.Item label={t('mission.idle_mission.mission')} name="missionId">
          <Select options={missionOptions} />
        </Form.Item>
      </Form>

      <Button onClick={() => submit()}>{t('utils.add')}</Button>
    </Wrapper>
  )
}

export default IdleMissionForm
