import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, FormProps, Input, message } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type FieldType = { genre_name_ch: string; genre_name_en: string }

const WarningIdGenreForm: FC = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const addMutation = useMutation({
    mutationFn: (payload: { genre_name_ch: string; genre_name_en: string }) => {
      return client.post('api/setting/add-warning-genre', payload)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['warning-genre']
      })
      form.resetFields()
    },
    onError: (e: ErrorResponse) => {
      errorHandler(e, messageApi)
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    addMutation.mutate(values)
  }

  return (
    <>
      {contextHolder}
      <Form form={form} autoComplete="off" onFinish={onFinish}>
        <Form.Item label={t('file.warning_list.genre_name_ch')} name="name_ch">
          <Input />
        </Form.Item>

        <Form.Item label={t('file.warning_list.genre_name_en')} name="name_en">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            color="primary"
            variant="filled"
            type="primary"
            htmlType="submit"
            loading={addMutation.isLoading}
          >
            {t('utils.submit')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default WarningIdGenreForm
