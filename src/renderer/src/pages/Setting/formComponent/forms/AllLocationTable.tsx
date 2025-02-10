/* eslint-disable @typescript-eslint/explicit-function-return-type */
import './form.css'
import {
  FormInstance,
  InputNumber,
  Select,
  InputRef,
  TableColumnType,
  Typography,
  Input,
  Checkbox,
  Button,
  message,
  Popconfirm,
  Flex
} from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'
import { LocationType } from '@renderer/utils/jotai'
import { useRef, useState } from 'react'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useTranslation } from 'react-i18next'
import { hoverLocation } from '@renderer/utils/gloable'
import { EditLocationListTableSwitch } from '@renderer/utils/siderGloble'
import { SearchOutlined, DeleteTwoTone } from '@ant-design/icons'
import { EditableCellProps, DataIndex } from './antd'

import React, { memo } from 'react'
import { Space, Table, Tag, Form } from 'antd'
import { borderColor } from '../../utils/utils'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import useMap from '@renderer/api/useMap'

const pointTypeWithColor = {
  Extra: '#2d7df6',
  充電區: '#e7ab29',
  預派點: '#7fc035',
  存貨區: '#e06a0a',
  待命區: '#e0dcd8'
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  ...restProps
}) => {
  const { t } = useTranslation()
  const pointTypeOption = [
    { value: 'Extra', label: t('utils.location_property.none') },
    { value: '充電區', label: t('utils.location_property.charge_station') },
    { value: '預派點', label: t('utils.location_property.prepare_side') },
    { value: '存貨區', label: t('utils.location_property.shelve') },
    { value: '待命區', label: t('utils.location_property.wait_side') }
  ]

  const canRotateOption = [
    { value: true, label: t('utils.yes') },
    { value: false, label: t('utils.no') }
  ]

  let inputNode

  switch (dataIndex) {
    case 'locationId':
      inputNode = <InputNumber disabled />
      break
    case 'x':
      inputNode = <InputNumber style={{ width: '150px' }} />
      break
    case 'y':
      inputNode = <InputNumber style={{ width: '150px' }} />
      break
    case 'areaType':
      inputNode = <Select options={pointTypeOption} style={{ width: '150px' }} />
      break
    case 'rotation':
      inputNode = <InputNumber style={{ width: '50px' }} />
      break
    case 'canRotate':
      inputNode = <Select options={canRotateOption} />
      break
    default:
      ;<InputNumber />
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

const AllLocationTable: React.FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ listeners, attributes, sortableId }) => {
  const [locationPanelForm] = Form.useForm()
  const searchInput = useRef<InputRef>(null)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const setHoverLoc = useSetAtom(hoverLocation)
  const { data: mapData } = useMap()
  const showAllLocationListTable = useAtomValue(EditLocationListTableSwitch)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [messageApi, contextHolders] = message.useMessage()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const saveLocationMutation = useMutation({
    mutationFn: (payload: LocationType) => {
      return client.post('api/setting/edit-edit-loc', payload)
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
      queryClient.refetchQueries({ queryKey: ['map'] })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const deleteLocationMutation = useMutation({
    mutationFn: (locationId: string) => {
      return client.post(`api/setting/delete-edit-loc`, {
        locationId
      })
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
      queryClient.refetchQueries({ queryKey: ['map'] })
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const deleteMultiLocationMutation = useMutation({
    mutationFn: (locationId: string[]) => {
      return client.post(`api/setting/delete-multi-edit-loc`, {
        locationId
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

    deleteMultiLocationMutation.mutate(selectedRowKeys as string[])
  }

  const isEditing = (record: LocationType) => record.locationId === editingKey

  const edit = (record: Partial<LocationType> & { locationId: string }) => {
    locationPanelForm.setFieldValue('x', Number(record.x))
    locationPanelForm.setFieldValue('y', Number(record.y))
    locationPanelForm.setFieldValue('canRotate', record.canRotate)
    locationPanelForm.setFieldValue('areaType', record.areaType)
    locationPanelForm.setFieldValue('rotation', record.rotation)
    locationPanelForm.setFieldValue('locationId', record.locationId)
    setEditingKey(record.locationId)
  }

  /** About search function */
  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm()
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
  }

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<LocationType> => ({
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
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text: string) => text
  })

  // --------------------------

  const savePos = () => {
    const payload = locationPanelForm.getFieldsValue() as LocationType
    const isNegative = Number(payload.locationId) <= 0

    const isDuplicateId = mapData?.locations.some((v) => {
      return v.locationId === payload.locationId.toString()
    })

    if (isNegative) {
      messageApi.warning(t('edit_location_panel.save_pose_notify.is_a_navigate'))
      return
    }

    if (isDuplicateId) {
      void messageApi.warning('duplicate id')
    }

    const sanitizedPayload = {
      ...payload,
      locationId: payload.locationId.toString()
    }

    saveLocationMutation.mutate(sanitizedPayload)
  }

  const cancel = () => {
    setEditingKey(null)
  }

  const save = () => {
    savePos()
    setEditingKey(null)
  }

  const deleteLocationInList = (id: string) => {
    deleteLocationMutation.mutate(id.toString())
  }

  const handleHover = (id: string) => {
    if (!id) return
    setHoverLoc(id)
  }

  const handleMouseLeave = () => {
    setHoverLoc('')
  }

  const columns = [
    {
      title: t('utils.location'),
      dataIndex: 'locationId',
      key: 'locationId',
      editable: true,
      width: '16%',
      sorter: (a: LocationType, b: LocationType) => Number(a.locationId) - Number(b.locationId),
      ...getColumnSearchProps('locationId')
    },
    {
      title: 'X',
      dataIndex: 'x',
      width: '8%',
      editable: true,
      key: 'x'
    },
    {
      title: 'Y',
      dataIndex: 'y',
      width: '8%',
      editable: true,
      key: 'y'
    },
    {
      title: t('utils.yaw'),
      dataIndex: 'rotation',
      editable: true,
      width: '16%',
      key: 'rotation'
    },
    {
      title: '是否可旋轉',
      dataIndex: 'canRotate',
      key: 'canRotate',
      width: '20%',
      editable: true,
      render: (_: unknown, record: LocationType) => {
        return <Checkbox checked={record.canRotate} />
      }
    },
    {
      title: t('utils.point_type'),
      dataIndex: 'areaType',
      editable: true,
      key: 'areaType',
      width: '20%',
      sorter: (a: LocationType, b: LocationType) => a.areaType.localeCompare(b.areaType),
      render: (_: unknown, record: LocationType) => {
        switch (record.areaType) {
          case 'Extra':
            return (
              <Tag color={pointTypeWithColor[record.areaType]} key={record.areaType}>
                {t('utils.location_property.none')}
              </Tag>
            )
          default:
            return (
              <Tag color={pointTypeWithColor[record.areaType]} key={record.areaType}>
                {record.areaType}
              </Tag>
            )
        }
      }
    },
    {
      dataIndex: 'operation',
      key: 'operation',

      render: (_: unknown, record: LocationType) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => {
                save()
              }}
              style={{ marginRight: 8 }}
            >
              {t('utils.save')}
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                cancel()
              }}
              style={{ marginRight: 8 }}
            >
              {t('utils.cancel')}
            </Typography.Link>
          </span>
        ) : (
          <div style={{ display: 'flex', gap: '4em' }}>
            <Typography.Link
              disabled={editingKey !== null}
              onClick={() => {
                edit(record)
              }}
            >
              {t('utils.edit')}
            </Typography.Link>
            <Popconfirm
              title={t('utils.delete')}
              description={t('edit_location_panel.table_notify.are_you_sure')}
              onConfirm={() => deleteLocationInList(record.locationId)}
              onCancel={cancel}
              okText={t('utils.yes')}
              cancelText={t('utils.no')}
            >
              <DeleteTwoTone twoToneColor="#f30303" />
            </Popconfirm>
          </div>
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
      onCell: (record: LocationType) => ({
        record,
        inputtype: col.dataIndex,
        dataIndex: col.dataIndex,
        key: col.key,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })
  return (
    <>
      {contextHolders}
      <div onMouseLeave={handleMouseLeave}>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('sider_output_form_name.locationList')}
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
            loading={deleteMultiLocationMutation.isLoading}
            disabled={selectedRowKeys.length === 0}
            danger
          >
            {t('utils.delete')}
          </Button>
          <Form form={locationPanelForm} component={false}>
            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys: React.Key[]) => {
                  setSelectedRowKeys([...selectedRowKeys])
                }
              }}
              rowKey={(property) => property.locationId}
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              dataSource={mapData?.locations.map((loc) => {
                return { ...loc, x: loc.x.toFixed(3), y: loc.y.toFixed(3) }
              })}
              columns={mergedColumns as []}
              pagination={{
                onChange: cancel,
                pageSize: 8
              }}
              onRow={(record) => {
                return {
                  onMouseEnter: () => handleHover(record.locationId)
                }
              }}
              bordered
            />
          </Form>
        </Flex>
      </div>
    </>
  )
}

export default memo(AllLocationTable)
