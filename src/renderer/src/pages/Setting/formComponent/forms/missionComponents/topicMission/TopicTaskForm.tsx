import client from '@renderer/api/axiosClient'
import useName from '@renderer/api/useAmrName'
import useAllMissionTitles from '@renderer/api/useMissionTitle'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, InputNumber, message, Select } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

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
  topicId: number
}

const TopicForm: FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { data: name } = useName()
  const { data: missionTitle } = useAllMissionTitles()
  const [messageApi, contextHolder] = message.useMessage()
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
      return client.post('api/setting/add-topic-task', payload)
    },
    onSuccess: async () => {
      void messageApi.success(t('utils.success'))
      await queryClient.refetchQueries({
        queryKey: ['topic-task']
      })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const submit = () => {
    const payload = form.getFieldsValue() as SubmitPayload

    if (!payload.amrId || payload.amrId.length === 0) {
      messageApi.warning(`amrId${t('mission.topic_mission.amr_warn')}`)
      return
    }

    for (const key of Object.keys(payload) as Array<keyof SubmitPayload>) {
      if (payload[key] === null) {
        messageApi.warning(`${key}${t('mission.topic_mission.missed')}`)
        return
      }
    }
    setMissionMutation.mutate(payload)
  }

  return (
    <Wrapper>
      {contextHolder}
      <Form form={form} title={t('mission.topic_mission.topic_mission')}>
        <Form.Item label={t('mission.topic_mission.car')} name="amrId">
          <Select mode="multiple" options={AmrOption} />
        </Form.Item>

        <Form.Item label="topic ID" name="topicId">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label={t('mission.topic_mission.mission')} name="missionId">
          <Select options={missionOptions} />
        </Form.Item>
      </Form>

      <Button color="primary" variant="filled" onClick={() => submit()}>
        {t('utils.add')}
      </Button>
    </Wrapper>
  )
}

export default TopicForm
