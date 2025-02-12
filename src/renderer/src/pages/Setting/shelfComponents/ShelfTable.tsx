import { FormatPainterOutlined } from '@ant-design/icons'
import { Skeleton, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC, memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import useLoc, { LocWithoutArr } from '@renderer/api/useLoc'
import useYaw from '@renderer/api/useYaw'
import { cargoStyle, isEditCargo } from '@renderer/utils/gloable'
import useShelf from '@renderer/api/useShelf'
import { ShelfWithoutList } from '@renderer/api/type/useShelf'
import SettingCargoStyleForm from './SettingCargoStyleForm'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`

type ShelfCell = {
  Loc: {
    loc: string
  }
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  dataIndex: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any
  inputType: string
  record: ShelfCell
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({ record, children, ...restProps }) => {
  return <td {...restProps}>{children}</td>
}

EditableCell.propTypes = {
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  inputType: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    Loc: PropTypes.shape({
      dirId: PropTypes.string,
      id: PropTypes.string.isRequired,
      loc: PropTypes.string.isRequired,
      areaType: PropTypes.string
    }).isRequired,
    ShelfCategory: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      Height: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          height: PropTypes.number.isRequired,
          shelfCategoryId: PropTypes.string.isRequired
        })
      )
    }),
    ShelfConfig: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        level: PropTypes.number.isRequired,
        hasCargo: PropTypes.bool.isRequired,
        shelfId: PropTypes.string.isRequired
      })
    ),
    shelfCategoryId: PropTypes.string.isRequired
  }).isRequired
}

const ShelfTable: FC<{
  selectedRowKeys: React.Key[]
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>
}> = ({ selectedRowKeys, setSelectedRowKeys }) => {
  const [selectId, setSelectId] = useState('')
  const setEditCargo = useSetAtom(isEditCargo)
  const { data } = useLoc(undefined)
  const { data: yaw } = useYaw()
  const setCStyle = useSetAtom(cargoStyle)
  const { data: shelfDataSource, isLoading: isLoadingShelf } = useShelf()
  const { t } = useTranslation()
  const handleEdit = (id: string) => {
    setSelectId(id)
    setEditCargo(true)
  }

  useEffect(() => {
    if (!data) return
    setCStyle(data as LocWithoutArr[])
  }, [data, setCStyle])

  const columns: ColumnsType<ShelfWithoutList> = [
    {
      title: t('edit_shelf_panel.location_id'),
      dataIndex: 'loc',
      key: 'loc',
      sorter: (a, b) => Number(a.Loc.locationId) - Number(b.Loc.locationId),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
      render: (_v, recorder) => {
        const { locationId } = recorder.Loc
        return locationId
      }
    },
    {
      title: t('edit_shelf_panel.category'),
      dataIndex: 'type',
      key: 'type',
      render: (_c, recorder) => {
        if (!recorder.ShelfCategory) return t('utils.no')
        const type = recorder.ShelfCategory.name
        return type
      }
    },
    {
      title: t('edit_shelf_panel.level'),
      dataIndex: 'level',
      key: 'level',
      render: (_v, recorder) => {
        if (!recorder.ShelfConfig) return 0
        const level = recorder.ShelfCategory.Height?.length
        return level
      }
    },
    {
      title: t('edit_shelf_panel.yaw'),
      dataIndex: 'yaw',
      key: 'yaw',
      render: (_v, recorder) => {
        if (!yaw) return 'not found'

        const yawIndex = yaw?.findIndex((s) => s.id === recorder.Loc.dirId)

        if (yawIndex === -1) return 'not found'

        return yaw[yawIndex].yaw
      }
    },

    {
      title: t('edit_shelf_panel.region_name'),
      dataIndex: 'region_name',
      key: 'region_name',
      render: (_v, recorder) => {
        return recorder.Loc?.loc_regions?.name || ''
      }
    },

    {
      title: t('edit_shelf_panel.detail'),
      dataIndex: 'detail1',
      key: 'detail1',
      render: (_v, recorder) => {
        return recorder.ShelfConfig.sort((a, b) => a.level - b.level).map((item) => {
          return (
            <>
              <p>
                {t('edit_shelf_panel.level')}: {item.level + 1}, {t('edit_shelf_panel.disabled')}:{' '}
                {item.disable ? t('utils.yes') : t('utils.no')}
              </p>
            </>
          )
        })
      }
    },

    {
      title: t('edit_shelf_panel.cargo_limit'),
      dataIndex: 'detail2',
      key: 'detail2',
      render: (_v, recorder) => {
        return recorder.ShelfConfig.sort((a, b) => a.level - b.level).map((item) => {
          return (
            <>
              <p>
                {t('edit_shelf_panel.level')}: {item.level + 1}, {t('edit_shelf_panel.height')}:{' '}
                {item.cargo_limit}
              </p>
            </>
          )
        })
      }
    },

    {
      title: t('edit_shelf_panel.setting'),
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_v, recorder) => {
        return <FormatPainterOutlined onClick={() => handleEdit(recorder.Loc.id)} />
      }
    }
  ]

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  // Jerusalem
  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record: ShelfWithoutList) => ({
        record
      })
    }
  })

  if (isLoadingShelf) return <Skeleton active />
  return (
    <Wrapper>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        rowSelection={rowSelection}
        dataSource={shelfDataSource as []}
        columns={mergedColumns as unknown as undefined}
        rowKey={(record: ShelfWithoutList) => record.id}
        pagination={{ pageSize: 8 }}
      />
      {selectId ? <SettingCargoStyleForm selectId={selectId} /> : []}
    </Wrapper>
  )
}

export default memo(ShelfTable)
