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
  message
} from 'antd'
import { catchError, distinctUntilChanged, filter, of } from 'rxjs'
import { useAtom } from 'jotai'
import { LocationType } from '@renderer/utils/jotai'
import { Modify } from '@renderer/utils/jotai'
import { useRef, useState } from 'react'
import { modifyLoc as Loc } from '@renderer/utils/gloable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useTranslation } from 'react-i18next'
import { hoverLocation, tempEditAndStoredLocation } from '@renderer/utils/gloable'
import { EditLocationListFormSwitch } from '@renderer/utils/siderGloble'
import { SearchOutlined, DeleteTwoTone, CloseSquareOutlined } from '@ant-design/icons'
import { EditableCellProps, DataIndex } from './antd'

import React, { memo } from 'react'
import { Space, Table, Tag, Form } from 'antd'

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

const AllLocationListForm: React.FC<{ locationPanelForm: FormInstance<unknown> }> = ({
  locationPanelForm
}) => {
  const searchInput = useRef<InputRef>(null)
  const [editingKey, setEditingKey] = useState<number | null>(null)
  const [opacity, setOpacity] = useState<'show' | 'hide'>('show')
  const [, setHoverLoc] = useAtom(hoverLocation)
  const [showAllLocationListForm, setShowAllLocationListForm] = useAtom(EditLocationListFormSwitch)
  const [TempEditAndStoredLocation, setTempEditAndStoredLocation] =
    useAtom(tempEditAndStoredLocation)
  const [modifyLoc, setModifyLoc] = useAtom(Loc)
  const [messageApi, contextHolders] = message.useMessage()
  const { t } = useTranslation()

  const isEditing = (record: LocationType) => record.locationId === editingKey

  const edit = (record: Partial<LocationType> & { locationId: number }) => {
    locationPanelForm.setFieldValue('x', record.x)
    locationPanelForm.setFieldValue('y', record.y)
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

  const editModifyHandler = (id: string) => {
    const staleModify = { ...modifyLoc }

    const existInAdd = modifyLoc.add.findIndex((f) => f === id)
    if (existInAdd !== -1) return

    const editList = [...staleModify.edit, id]
    const deleteList = [...staleModify.delete].filter((d) => d !== id)

    const newModify: Modify = {
      add: staleModify.add,
      edit: [...new Set(editList)] as string[],
      delete: deleteList
    }

    setModifyLoc(newModify)
  }

  const deleteModifyHandler = (id: string) => {
    const staleModify = { ...modifyLoc }

    const existInAdd = staleModify.add.findIndex((f) => f === id)

    const deleteList = existInAdd !== -1 ? [...staleModify.delete] : [...staleModify.delete, id]

    const addList = [...staleModify.add].filter((d) => d !== id)
    const editList = [...staleModify.edit].filter((d) => d !== id)

    const newModify: Modify = {
      add: addList,
      edit: editList,
      delete: [...new Set(deleteList)] as string[]
    }

    setModifyLoc(newModify)
  }

  const savePos = () => {
    const payload = locationPanelForm.getFieldsValue() as LocationType
    const sanitizedPayload = {
      ...payload,
      locationId: Number(payload.locationId),
      rotation: Number(payload.rotation)
    }
    const index = TempEditAndStoredLocation.findIndex((v) => {
      return v.locationId === payload.locationId
    })

    if (index === -1) return

    const updateLocationList = [...TempEditAndStoredLocation]
    updateLocationList[index] = { ...sanitizedPayload }

    editModifyHandler(sanitizedPayload.locationId.toString())
    setTempEditAndStoredLocation(updateLocationList)
    void messageApi.success('ok', 1)
  }

  const cancel = () => {
    setEditingKey(null)
  }

  const save = () => {
    savePos()
    setEditingKey(null)
  }

  const deleteLocationInList = (id: number) => {
    deleteModifyHandler(id.toString())
    setTempEditAndStoredLocation((prev) => prev.filter((v) => v.locationId !== id))
  }

  const handleHover = (id: number) => {
    if (!id) return
    of(id.toString())
      .pipe(
        distinctUntilChanged((prev, curr) => prev !== curr),
        filter((v) => v !== undefined),
        catchError((error) => {
          console.log('An error occurred:', error)
          return of('')
        })
      )
      .subscribe((v) => {
        setHoverLoc(v)
      })
  }

  const columns = [
    {
      title: t('utils.location'),
      dataIndex: 'locationId',
      key: 'locationId',
      editable: true,
      width: '16%',
      sorter: (a: LocationType, b: LocationType) => a.locationId - b.locationId,
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
            <DeleteTwoTone
              twoToneColor="#f30303"
              onClick={() => deleteLocationInList(record.locationId)}
            />
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
      <div
        className={`form-button-wrap ${showAllLocationListForm ? 'form-button-wrap-animate' : ''}`}
      >
        {showAllLocationListForm ? (
          <>
            <div className="hidden-close-btn-wrap">
              <Button
                onClick={() => {
                  setOpacity((pre) => {
                    if (pre === 'hide') {
                      return 'show'
                    }
                    return 'hide'
                  })
                }}
              >
                {opacity === 'show' ? t('utils.opacity') : t('utils.show')}
              </Button>
              <CloseSquareOutlined
                onClick={() => setShowAllLocationListForm(false)}
                className="close-table-icon"
              />
            </div>
            <div
              className="table-wrap"
              style={{
                height: '100%',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'auto',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                opacity: `${opacity === 'hide' ? '0.2' : '1'}`
              }}
            >
              <Form form={locationPanelForm} component={false}>
                <Table
                  style={{ opacity: '1' }}
                  rowKey={(property) => property.locationId}
                  components={{
                    body: {
                      cell: EditableCell
                    }
                  }}
                  dataSource={TempEditAndStoredLocation.map((loc) => {
                    return { ...loc, x: loc.x.toFixed(3), y: loc.y.toFixed(3) }
                  })}
                  columns={mergedColumns as []}
                  pagination={{
                    onChange: cancel,
                    pageSize: 20
                  }}
                  onRow={(record) => ({
                    onMouseEnter: () => {
                      handleHover(record.locationId)
                    }
                  })}
                  bordered
                />
              </Form>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default memo(AllLocationListForm)
