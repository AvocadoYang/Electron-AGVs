import client from '@renderer/api/axiosClient'
import useRegionName from '@renderer/api/useLocRegionName'
import useAllMissionTitles from '@renderer/api/useMissionTitle'
import useShelfCategory from '@renderer/api/useShelfCategory'
import useYaw from '@renderer/api/useYaw'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Drawer, Form, FormProps, InputNumber, message, Select } from 'antd'
import { Dispatch, FC, Key, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

type FieldType = {
  shelfId?: Key[]
  category: string
  load: string
  offload: string
  yaw: string
  cargo_limit
}

const ShelfDrawer: FC<{
  openDrawer: boolean
  setOpenDrawer: Dispatch<SetStateAction<boolean>>
  selectedRowKeys: Key[]
}> = ({ openDrawer, setOpenDrawer, selectedRowKeys }) => {
  const { data: misTitle } = useAllMissionTitles()
  const { data: allCategory } = useShelfCategory()
  const { data: yaw } = useYaw()
  const { data: regionName } = useRegionName()
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  const submitMutation = useMutation({
    mutationFn: (payload: FieldType) => {
      return client.post('api/setting/edit-multi-shelf', payload)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['shelf']
      })
      messageApi.success(t('utils.success'))
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)

    const payload: FieldType = {
      ...values,
      shelfId: selectedRowKeys
    }

    submitMutation.mutate(payload)
    form.resetFields()
    setOpenDrawer(false)
  }

  return (
    <>
      {contextHolder}
      <Drawer
        title={t('edit_shelf_panel.edit_shelf')}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Card>
          <Form onFinish={onFinish} form={form} autoComplete="off">
            <Form.Item label={t('edit_shelf_panel.category')} name="category">
              <Select
                disabled={selectedRowKeys.length === 0}
                options={allCategory?.map((v) => {
                  return { value: v.id, label: v.name }
                })}
              />
            </Form.Item>

            <Form.Item label={t('edit_shelf_panel.load_mission')} name="load">
              <Select disabled={selectedRowKeys.length === 0} allowClear>
                {misTitle?.map((v) => (
                  <Select.Option key={v.id} value={v.id}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={t('edit_shelf_panel.offload_mission')} name="offload">
              <Select disabled={selectedRowKeys.length === 0} allowClear>
                {misTitle?.map((v) => (
                  <Select.Option key={v.id} value={v.id}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={t('edit_shelf_panel.cargo_limit')} name="cargo_limit">
              <InputNumber disabled={selectedRowKeys.length === 0} />
            </Form.Item>

            <Form.Item label={t('edit_shelf_panel.region_name')} name="region-name">
              <Select
                disabled={selectedRowKeys.length === 0}
                options={regionName?.map((r) => {
                  return {
                    label: r?.name,
                    value: r?.id
                  }
                })}
              />
            </Form.Item>

            <Form.Item label={null}>
              <Button color="primary" variant="filled" type="primary" htmlType="submit">
                {t('utils.submit')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Drawer>
    </>
  )
}

export default ShelfDrawer
