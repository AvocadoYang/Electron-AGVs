/* eslint-disable no-void */
import { nanoid } from 'nanoid'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tooltip,
  Typography,
  message
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import useWarningGenre from '@renderer/api/useWarningGenre'
import TextArea from 'antd/es/input/TextArea'
import useWarningTable from '@renderer/api/useWarningTable'
import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'

const BtnWrapper = styled.div`
  display: flex;
`

const Btn = styled.div`
  width: 66px;
`

interface WarningRecord {
  id: number
  is_open_buzzer: boolean
  info_ch: string
  info_en: string
  solution_ch: string
  solution_en: string
  sensor_location_en: string
  sensor_location_ch: string
  genre_id: string
  genre_name_ch: string
  genre_name_en: string
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  record: WarningRecord
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  ...restProps
}) => {
  const { t } = useTranslation()
  const { data: warningGenreData } = useWarningGenre()
  let inputNode
  switch (dataIndex) {
    case 'id':
      inputNode = <InputNumber />
      break
    case 'is_open_buzzer':
      inputNode = (
        <Radio.Group>
          <Radio value={false}>{t('utils.no')}</Radio>
          <Radio value>{t('utils.yes')}</Radio>
        </Radio.Group>
      )
      break
    case 'info_ch':
      inputNode = <TextArea />
      break
    case 'info_en':
      inputNode = <TextArea />
      break
    case 'solution_ch':
      inputNode = <TextArea />
      break
    case 'solution_en':
      inputNode = <TextArea />
      break
    case 'sensor_location_en':
      inputNode = <TextArea />
      break
    case 'sensor_location_ch':
      inputNode = <TextArea />
      break
    case 'genre_id':
      inputNode = (
        <Select
          options={warningGenreData?.map((v) => ({
            label: `${v?.name_ch} | ${v?.name_en}`,
            value: v?.id
          }))}
        />
      )
      break

    default:
      ;<Input />
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: 'Please Input !'
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

EditableCell.propTypes = {
  children: PropTypes.node.isRequired
}

const WarningListTable: FC = () => {
  const { t } = useTranslation()
  const { data: warningData, refetch } = useWarningTable()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const [editingKey, setEditingKey] = useState<number | null>(null)
  const isEditing = (record: WarningRecord) => record?.id === editingKey

  const editMutation = useMutation({
    mutationFn: (payload: WarningRecord) => {
      return client.post('api/setting/edit-warning', payload)
    },
    onSuccess() {
      messageApi.success('success')
      // eslint-disable-next-line no-void
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: number }) => {
      return client.post('api/setting/delete-warning', payload)
    },
    onSuccess: async () => {
      // eslint-disable-next-line no-void
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const edit = (record: Partial<WarningRecord> & { id: number }) => {
    form.setFieldValue('id', record.id)
    form.setFieldValue('is_open_buzzer', record.is_open_buzzer)
    form.setFieldValue('info_ch', record.info_ch)
    form.setFieldValue('info_en', record.info_en)
    form.setFieldValue('solution_ch', record.solution_ch)
    form.setFieldValue('solution_en', record.solution_en)
    form.setFieldValue('sensor_location_en', record.sensor_location_en)
    form.setFieldValue('sensor_location_ch', record.sensor_location_ch)
    form.setFieldValue('genre_id', record.genre_id)

    setEditingKey(record.id)
  }

  const cancel = () => {
    setEditingKey(null)
  }

  const handleDelete = (record: Partial<WarningRecord> & { id: number }) => {
    deleteMutation.mutate({ id: record.id })
  }

  const save = (key: number) => {
    const data = form.getFieldsValue() as WarningRecord

    const payload = {
      ...data,
      origin_id: key
    }

    editMutation.mutate(payload)
    setEditingKey(null)
  }

  const columns = [
    {
      title: t('file.warning_list.error_code'),
      dataIndex: 'id',
      key: 'id',
      editable: true,
      sorter: (a: WarningRecord, b: WarningRecord) => a.id - b.id
    },
    {
      title: t('file.warning_list.genre'),
      dataIndex: 'genre_id',
      key: 'genre_id',
      editable: true,
      render(_: unknown, record: WarningRecord) {
        return `${record.genre_name_ch}  ${record.genre_name_en}`
      }
    },
    {
      title: t('file.warning_list.add_new_genre'),
      dataIndex: 'is_open_buzzer',
      key: 'is_open_buzzer',
      editable: true,
      render(_: unknown, record: WarningRecord) {
        return record.is_open_buzzer ? t('utils.yes') : t('utils.no')
      }
    },
    {
      title: t('file.warning_list.info_ch'),
      dataIndex: 'info_ch',
      key: 'info_ch',
      editable: true
    },
    {
      title: t('file.warning_list.info_en'),
      dataIndex: 'info_en',
      key: 'info_en',
      editable: true
    },

    {
      title: t('file.warning_list.solution_ch'),
      dataIndex: 'solution_ch',
      key: 'solution_ch',
      editable: true
    },

    {
      title: t('file.warning_list.solution_en'),
      dataIndex: 'solution_en',
      key: 'solution_en',
      editable: true
    },

    {
      title: t('file.warning_list.sensor_location_ch'),
      dataIndex: 'sensor_location_ch',
      key: 'sensor_location_ch',
      editable: true
    },

    {
      title: t('file.warning_list.sensor_location_en'),
      dataIndex: 'sensor_location_en',
      key: 'sensor_location_en',
      editable: true
    },
    {
      title: '',
      width: 30,
      dataIndex: 'operation',
      key: nanoid(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(_v: unknown, record: WarningRecord) {
        const editable = isEditing(record)

        return editable ? (
          <BtnWrapper>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              <Btn>{t('utils.save')}</Btn>
            </Typography.Link>
            <Typography.Link onClick={() => cancel()} style={{ marginRight: 8 }}>
              <Btn>{t('utils.cancel')}</Btn>
            </Typography.Link>
          </BtnWrapper>
        ) : (
          <BtnWrapper>
            <Btn>
              <Tooltip placement="right" title={t('utils.edit')} key={nanoid()}>
                <EditOutlined onClick={() => edit(record)} />
              </Tooltip>
            </Btn>

            <Btn>
              <Popconfirm
                color="#ff1c1c"
                title="Sure to delete?"
                onConfirm={() => handleDelete(record)}
              >
                <Tooltip placement="right" title={t('utils.delete')} color="red" key={nanoid()}>
                  <DeleteOutlined twoToneColor="#eb2f2f" />
                </Tooltip>
              </Popconfirm>
            </Btn>
          </BtnWrapper>
        )
      }
    }
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: WarningRecord) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <>
      {contextHolder}

      <Form form={form} component={false}>
        <Table
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          columns={mergedColumns}
          dataSource={warningData as WarningRecord[]}
        />
      </Form>
    </>
  )
}

export default WarningListTable
