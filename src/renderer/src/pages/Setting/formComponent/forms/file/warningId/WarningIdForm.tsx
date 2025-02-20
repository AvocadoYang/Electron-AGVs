import client from '@renderer/api/axiosClient'
import useWarningGenre from '@renderer/api/useWarningGenre'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, FormProps, Input, InputNumber, message, Radio, Select } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface FieldType {
  id: number
  is_open_buzzer: boolean
  info_ch: string
  info_en: string
  solution_ch: string
  solution_en: string
  sensor_location_en: string
  sensor_location_ch: string
  genre_id: string
}

const WarningIdForm: FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { data: warningGenreData } = useWarningGenre()
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const addMutation = useMutation({
    mutationFn: (values: FieldType) => {
      return client.post('api/setting/add-warning', values)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['warning-table']
      })
      form.resetFields()
      messageApi.success('success')
    },
    onError: (e: ErrorResponse) => {
      errorHandler(e, messageApi)
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Form values:', values)
    addMutation.mutate(values)
  }

  return (
    <>
      {contextHolder}
      <Form form={form} autoComplete="off" onFinish={onFinish}>
        <Form.Item label={t('file.warning_list.error_code')} name="id">
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item label={t('file.warning_list.buzzer')} name="is_open_buzzer">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>{t('utils.yes')}</Radio.Button>
            <Radio.Button value={false}>{t('utils.no')}</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('file.warning_list.info_ch')} name="info_ch">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.info_en')} name="info_en">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.solution_ch')} name="solution_ch">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.solution_en')} name="solution_en">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.sensor_location_en')} name="sensor_location_en">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.sensor_location_ch')} name="sensor_location_ch">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.genre')} name="warning_genre_id">
          <Select
            options={warningGenreData?.map((v) => ({
              label: `${v?.name_ch} | ${v?.name_en}`,
              value: v?.id
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={addMutation.isLoading}>
            {t('utils.submit')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default WarningIdForm
