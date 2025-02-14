import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons'
import client from '@renderer/api/axiosClient'
import { YawType, YawTypeWithoutList } from '@renderer/api/useYaw'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Row, Col, Popconfirm, Skeleton, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC } from 'react'

const YawTable: FC<{
  setOpenYawModel: React.Dispatch<React.SetStateAction<boolean>>
  setSelectYawId: React.Dispatch<React.SetStateAction<string>>
  yawDataSource: YawType
}> = ({ setOpenYawModel, setSelectYawId, yawDataSource }) => {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return client.post(`api/setting/delete-yaw`, {
        id
      })
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['yaw']
      })
      await queryClient.refetchQueries({ queryKey: ['cargoLoc-mission'] })
    }
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleEdit = (id: string) => {
    setSelectYawId(id)
    setOpenYawModel(true)
  }

  const columns: ColumnsType<YawTypeWithoutList> = [
    {
      title: 'yaw',
      dataIndex: 'yaw',
      key: 'yaw',
      sorter: (a, b) => a.yaw - b.yaw
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record: YawTypeWithoutList) => {
        return (
          <>
            <Row gutter={16}>
              <Col className="gutter-row" span={8}>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                  <DeleteTwoTone twoToneColor="#a61d24" />
                </Popconfirm>
              </Col>
              <Col className="gutter-row" span={8}>
                <EditTwoTone twoToneColor="#33bcb7" onClick={() => handleEdit(record.id)} />
              </Col>
            </Row>
          </>
        )
      }
    }
  ]
  if (!yawDataSource) return <Skeleton active />

  return (
    <Table
      dataSource={yawDataSource}
      columns={columns}
      rowKey={(record: YawTypeWithoutList) => record.id}
    />
  )
}

export default YawTable
