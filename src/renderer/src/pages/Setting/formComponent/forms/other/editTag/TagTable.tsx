/* eslint-disable no-void */
import { nanoid } from 'nanoid'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  Button,
  ColorPicker,
  Form,
  Input,
  Popconfirm,
  Table,
  Tooltip,
  Typography,
  message
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import useCategory from '@renderer/api/useCategory'
import client from '@renderer/api/axiosClient'

const BtnWrapper = styled.div`
  display: flex;
`

const Btn = styled.div`
  width: 66px;
`

// bitch ant design not support the type
interface Color {
  toHexString(): string
}

interface DataType {
  id: string
  tagName: string
  color: string
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  inputType: string
  record: DataType
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode
  switch (dataIndex) {
    case 'tagName':
      inputNode = <Input style={{ width: '150px' }} />
      break
    case 'color':
      inputNode = <ColorPicker format="hex" size="small" showText />
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
              message: `Please Input !`
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

const TagTable: FC = () => {
  const { t } = useTranslation()
  const { data: category, refetch } = useCategory()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const isEditing = (record: DataType) => record?.id === editingKey

  const editMutation = useMutation({
    mutationFn: (payload: DataType) => {
      return client.post(`api/setting/edit-category`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const addMutation = useMutation({
    mutationFn: () => {
      return client.post(`api/setting/add-category`)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post(`api/setting/delete-category`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const edit = (record: Partial<DataType> & { id: string }) => {
    if (record.tagName === 'none') {
      void messageApi.warning(t('other.edit_mission_tag.forbidden_edit_default'))
      return
    }

    form.setFieldValue('tagName', record.tagName)
    form.setFieldValue('color', record.color)

    setEditingKey(record.id)
  }

  const handleAdd = () => {
    addMutation.mutate()
  }

  const cancel = () => {
    setEditingKey(null)
  }

  const handleDelete = (record: Partial<DataType> & { id: string }) => {
    if (record.tagName === '強制') {
      void messageApi.warning(t('other.edit_mission_tag.forbidden_edit_default'))
      return
    }

    deleteMutation.mutate({ id: record.id })
  }

  const isColorWithToHexString = (obj: Color): obj is { toHexString: () => string } => {
    return obj && typeof obj.toHexString === 'function'
  }

  const save = (key: string) => {
    const color = form.getFieldValue('color') as Color

    const hexColor = isColorWithToHexString(color) ? color.toHexString() : (color as string)

    const payload = {
      id: key,
      tagName: form.getFieldValue('tagName') as string,
      color: hexColor
    }

    editMutation.mutate(payload)
    setEditingKey(null)
  }

  const columns = [
    {
      title: t('other.edit_mission_tag.tag'),
      dataIndex: 'tagName',
      key: 'tagName',
      width: 300,
      editable: true
    },
    {
      title: t('other.edit_mission_tag.color'),
      dataIndex: 'color',
      key: 'color',
      width: 100,
      editable: true,
      render: (_v: unknown, record: DataType) => {
        return (
          <ColorPicker
            disabled
            format="hex"
            size="small"
            showText
            value={record.color}
            onChange={(v) => form.setFieldValue('color', v.toHexString())}
          />
        )
      }
    },
    {
      title: '',
      width: 30,
      dataIndex: 'operation',
      key: nanoid(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(_v: unknown, record: DataType) {
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
                  <DeleteOutlined />
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
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <>
      {contextHolder}
      <Button color="primary" variant="filled" onClick={() => handleAdd()}>
        {t('utils.add')}
      </Button>
      <Form form={form} component={false}>
        <Table
          rowKey={() => nanoid()}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          columns={mergedColumns}
          dataSource={category as DataType[]}
        />
      </Form>
    </>
  )
}

export default TagTable
