/* eslint-disable no-void */
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  Popconfirm,
  Table,
  Tooltip,
  Typography,
  message
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import usePallet from '@renderer/api/usePallet'
import client from '@renderer/api/axiosClient'
import FormHr from '../../../../utils/FormHr'

// bitch ant design not support the type
interface Color {
  toHexString(): string
}

interface DataType {
  id: string
  name: string
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
    case 'name':
      inputNode = <Input />
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
  editing: PropTypes.bool.isRequired,
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  inputType: PropTypes.string.isRequired,
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

const PalletTable: React.FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { t } = useTranslation()
  const { data: pallet, refetch } = usePallet()
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const isEditing = (record: DataType) => record?.id === editingKey

  const editMutation = useMutation({
    mutationFn: (payload: DataType) => {
      return client.post(`api/setting/edit-pallet`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const addMutation = useMutation({
    mutationFn: () => {
      return client.post(`api/setting/add-pallet`)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post(`api/setting/delete-pallet`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const edit = (record: Partial<DataType> & { id: string }) => {
    if (record.name === 'none') {
      void messageApi.warning(t('edit_pallet.edit_default_warning'))
      return
    }

    form.setFieldValue('name', record.name)
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
    if (record.name === 'none') {
      void messageApi.warning(t('edit_pallet.edit_default_warning'))
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
      name: form.getFieldValue('name') as string,
      color: hexColor
    }

    if (payload.name === null || payload.name.trim() === '') {
      messageApi.warning(t('edit_pallet.name_warn'))
      return
    }

    editMutation.mutate(payload)
    setEditingKey(null)
  }

  const columns = [
    {
      title: t('edit_pallet.type'),
      dataIndex: 'name',
      key: 'name',
      editable: true
    },
    {
      title: t('edit_pallet.color'),
      dataIndex: 'color',
      key: 'color',
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
      dataIndex: 'operation',
      key: nanoid(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(_v: unknown, record: DataType) {
        const editable = isEditing(record)

        return editable ? (
          <Flex gap="small">
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              <Button color="primary" variant="filled" type="link">
                {t('utils.save')}
              </Button>
            </Typography.Link>
            <Typography.Link onClick={() => cancel()} style={{ marginRight: 8 }}>
              <Button color="default" variant="filled" type="link">
                {t('utils.cancel')}
              </Button>
            </Typography.Link>
          </Flex>
        ) : (
          <Flex gap="small">
            <Tooltip placement="right" title={t('utils.cancel')} key={nanoid()}>
              <Button color="default" variant="filled" type="link">
                <EditOutlined onClick={() => edit(record)} />
              </Button>
            </Tooltip>
            <Tooltip placement="right" title={t('utils.delete')} color="red" key={nanoid()}>
              <Button color="danger" variant="filled" type="link">
                <Popconfirm
                  color="#ff1c1c"
                  title="Sure to delete?"
                  onConfirm={() => handleDelete(record)}
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Button>
            </Tooltip>
          </Flex>
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

      <div>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('edit_pallet.edit_pallet')}
        </h3>
        <FormHr sortableId={sortableId}></FormHr>
        <Flex gap="middle" justify="flex-start" align="start" vertical>
          <Button
            icon={<PlusOutlined />}
            color="primary"
            variant="filled"
            type="primary"
            onClick={() => handleAdd()}
          >
            {t('utils.add')}
          </Button>
          <Form form={form} component={false}>
            <Table
              rowKey={(record) => record.id}
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              columns={mergedColumns}
              dataSource={pallet as DataType[]}
            />
          </Form>
        </Flex>
      </div>
    </>
  )
}

export default PalletTable
