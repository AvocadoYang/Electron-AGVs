import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  TableColumnType,
  Tooltip,
  Typography
} from 'antd'
import { memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useSetAtom } from 'jotai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useMap from '@renderer/api/useMap'
import { hoverRoad } from '@renderer/utils/gloable'
import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import { borderColor } from '../../utils/utils'

type RoadListType = {
  roadId: string
  validYawList?: string | number[]
  spot1Id: string
  spot2Id: string
  x1: number
  y1: number
  x2: number
  y2: number
  disabled: boolean
  limit: boolean
  roadType: string
}

type DataIndex = keyof RoadListType

const BtnWrapper = styled.div`
  display: flex;
`

const Btn = styled.div`
  width: 66px;
`

const yawOptions = ['0', '90', '180', '270', '*'].map((v) => ({ value: v }))

const whenAll = yawOptions.map((m) => {
  const disabled = ['0', '90', '180', '270'].includes(m.value)
  return { ...m, disabled }
})

const when0 = yawOptions.map((m) => {
  const disabled = ['*', '90', '270'].includes(m.value)
  return { ...m, disabled }
})

const when90 = yawOptions.map((m) => {
  const disabled = ['0', '180', '*'].includes(m.value)
  return { ...m, disabled }
})

const when180 = yawOptions.map((m) => {
  const disabled = ['*', '90', '270'].includes(m.value)
  return { ...m, disabled }
})

const when270 = yawOptions.map((m) => {
  const disabled = ['0', '180', '270'].includes(m.value)
  return { ...m, disabled }
})

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  inputType: string
  record: RoadListType
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
  const { t } = useTranslation()
  const [chooseAngle, setChooseAngle] = useState<string>('')
  const [yawOption, setYawOption] = useState<typeof yawOptions>(yawOptions)

  useEffect(() => {
    switch (chooseAngle) {
      case '*':
        setYawOption(whenAll)
        break
      case '0':
        setYawOption(when0)
        break
      case '90':
        setYawOption(when90)
        break
      case '180':
        setYawOption(when180)
        break
      case '270':
        setYawOption(when270)
        break
      default:
      // console.log('errpr')
    }
  }, [chooseAngle])

  switch (dataIndex) {
    case 'spot1Id':
      inputNode = <InputNumber disabled />
      break
    case 'spot2Id':
      inputNode = <InputNumber disabled />
      break
    case 'disable':
      inputNode = <Switch />
      break
    case 'limit':
      inputNode = <Switch />
      break
    case 'roadType':
      inputNode = (
        <Radio.Group buttonStyle="solid" disabled>
          <Radio.Button value="oneWayRoad">{t('edit_road_panel.single_road')}</Radio.Button>
          <Radio.Button value="twoWayRoad">{t('edit_road_panel.two_way_road')}</Radio.Button>
        </Radio.Group>
      )
      break
    case 'validYawList':
      inputNode = (
        <Select
          mode="multiple"
          options={yawOption}
          onChange={(value: string[]) => {
            setChooseAngle(value[0] || '')
          }}
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
    roadId: PropTypes.string.isRequired,
    validYawList: PropTypes.string.isRequired,
    spot1Id: PropTypes.string.isRequired,
    spot2Id: PropTypes.string.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    x2: PropTypes.number.isRequired,
    y2: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    limit: PropTypes.bool.isRequired,
    roadType: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

const ActiveBox = styled.div`
  min-width: 4em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

type DotStyle = {
  active: boolean
}

type SubmitRoad = {
  roadId: string
  limit: boolean
  validYawList: number[] | string[]
}

const Dot = styled.div<DotStyle>`
  border-radius: 99%;
  width: 7px;
  height: 7px;
  background-color: ${(prop) => (prop.active ? '#979797' : '#2bea00')};
`

const RoadList: React.FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { data: currentMap } = useMap()
  const searchInput = useRef<InputRef>(null)
  const [messageApi, contextHolders] = message.useMessage()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const isEditing = (record: RoadListType) => record.roadId === editingKey
  const setHoverRoad = useSetAtom(hoverRoad)
  const [formRoad] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const deleteRoadMutation = useMutation({
    mutationFn: (roadId: string) => {
      return client.post('api/setting/delete-edit-road', { roadId })
    },
    onSuccess: () => {
      void messageApi.success('success')
      queryClient.refetchQueries({ queryKey: ['map'] })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm()
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
  }

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<RoadListType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t('utils.search')}
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t('utils.reset')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
            }}
          >
            {t('utils.filter')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            {t('utils.cancel')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) as boolean,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text: string) => text
  })

  const handleHover = (id: string) => {
    if (!id) return
    setHoverRoad(id)
  }

  const handleMouseLeave = () => {
    setHoverRoad('')
  }

  const editRoadMutation = useMutation({
    mutationFn: (payload: SubmitRoad) => {
      return client.post(`api/setting/edit-edit-road`, payload)
    },
    onSuccess: () => {
      void messageApi.success('success')
      queryClient.refetchQueries({ queryKey: ['map'] })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const edit = (record: Partial<RoadListType> & { roadId: string }) => {
    const a = () => {
      if (record.validYawList === '*') {
        return ['*']
      }
      return (record.validYawList as number[]).map((c) => c.toString())
    }

    formRoad.setFieldValue('spot1Id', record.spot1Id)
    formRoad.setFieldValue('spot2Id', record.spot2Id)
    formRoad.setFieldValue('limit', record.limit)
    formRoad.setFieldValue('roadType', record.roadType)
    formRoad.setFieldValue('validYawList', a())

    setEditingKey(record.roadId)
  }

  const deleteMultiRoadMutation = useMutation({
    mutationFn: (roadId: string[]) => {
      return client.post('api/setting/delete-multi-edit-road', {
        roadId
      })
    },
    onSuccess: () => {
      void messageApi.success('success')
      queryClient.refetchQueries({ queryKey: ['map'] })
      setSelectedRowKeys([])
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const deleteMultiItem = () => {
    if (selectedRowKeys.length === 0) return

    deleteMultiRoadMutation.mutate(selectedRowKeys as string[])
  }

  const cancel = () => {
    setEditingKey(null)
  }

  const save = (key: string) => {
    const payload: SubmitRoad = {
      roadId: key,
      limit: formRoad.getFieldValue('limit') as boolean,
      validYawList: formRoad.getFieldValue('validYawList') as number[] | string[]
    }

    editRoadMutation.mutate(payload)

    formRoad.setFieldsValue(payload)
    setEditingKey(null)
  }

  const columns = [
    {
      title: t('edit_road_panel.start_point'),
      dataIndex: 'spot1Id',
      key: 'spot1Id',
      editable: true,
      sorter: (a: RoadListType, b: RoadListType) => Number(a.spot1Id) - Number(b.spot2Id),
      ...getColumnSearchProps('spot1Id')
    },
    {
      title: t('edit_road_panel.end_point'),
      dataIndex: 'spot2Id',
      key: 'spot2Id',
      editable: true,
      sorter: (a: RoadListType, b: RoadListType) => Number(a.spot2Id) - Number(b.spot1Id),
      ...getColumnSearchProps('spot2Id')
    },

    {
      title: t('utils.point_type'),
      dataIndex: 'roadType',
      key: 'roadType',
      render: (_v: unknown, record: RoadListType) => {
        return record.roadType === 'oneWayRoad'
          ? t('edit_road_panel.single_road')
          : t('edit_road_panel.two_way_road')
      },
      editable: true,
      sorter: (a: RoadListType, b: RoadListType) => a.roadType.localeCompare(b.roadType)
    },
    {
      title: t('edit_road_panel.yaw'),
      dataIndex: 'validYawList',
      key: 'validYawList',
      editable: true,
      render: (_: unknown, record: RoadListType) => {
        return record.validYawList?.toString() || ''
      }
    },
    {
      title: t('edit_road_panel.limit'),
      dataIndex: 'limit',
      key: 'limit',
      editable: true,
      render: (_: unknown, record: RoadListType) => {
        return record.limit ? t('utils.yes') : t('utils.no')
      }
    },

    {
      title: t('edit_road_panel.disabled'),
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: (_v: unknown, record: RoadListType) => {
        return (
          <ActiveBox>
            <Dot active={record.disabled as boolean} />{' '}
            <>{record.disabled ? t('utils.no') : t('utils.yes')}</>
          </ActiveBox>
        )
      }
    },

    {
      title: '',
      width: 30,
      dataIndex: 'operation',
      key: nanoid(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(_v: unknown, record: RoadListType) {
        const editable = isEditing(record)

        return editable ? (
          <BtnWrapper>
            <Typography.Link onClick={() => save(record.roadId)} style={{ marginRight: 8 }}>
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
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this road?"
              onConfirm={() => deleteRoadMutation.mutate(record.roadId)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Btn>
                <Tooltip placement="right" title={t('utils.delete')} color="red" key={nanoid()}>
                  <DeleteOutlined color="#ff0707" />
                </Tooltip>
              </Btn>
            </Popconfirm>
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
      onCell: (record: RoadListType) => ({
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
      {contextHolders}
      <h3 className="drop_button_style" {...listeners} {...attributes}>
        {t('edit_road_panel.road_table')}
      </h3>

      <hr
        style={{
          marginTop: '1px',
          marginBottom: '10px',
          border: `4px solid ${borderColor(sortableId)}`
        }}
      ></hr>
      <Flex
        gap="middle"
        justify="flex-start"
        align="start"
        vertical
        onMouseLeave={handleMouseLeave}
      >
        <Button
          onClick={() => deleteMultiItem()}
          loading={deleteMultiRoadMutation.isLoading}
          disabled={selectedRowKeys.length === 0}
          danger
        >
          {t('utils.delete')}
        </Button>
        <Form form={formRoad} component={false}>
          <Table
            dataSource={currentMap?.roads}
            rowKey={(v) => v.roadId}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys: React.Key[]) => {
                setSelectedRowKeys([...selectedRowKeys])
              }
            }}
            components={{
              body: {
                cell: EditableCell
              }
            }}
            onRow={(record) => ({
              onMouseEnter: () => {
                handleHover(record.roadId)
              }
            })}
            columns={mergedColumns as []}
          />
        </Form>
      </Flex>
    </>
  )
}

export default memo(RoadList)
