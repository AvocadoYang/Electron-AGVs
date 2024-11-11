/* eslint-disable @typescript-eslint/explicit-function-return-type */
import './form.css'
import { FormInstance } from 'antd'
import { useAtom } from 'jotai'
import { hoverLocation } from '@renderer/utils/gloable'
import { EditLocationListFormSwitch } from '@renderer/utils/siderGloble'
import { CloseSquareOutlined } from '@ant-design/icons'

import React, { memo } from 'react'
import { Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'

interface DataType {
  key: string
  test: string
  name: string
  age: number
  address: string
  tags: string[]
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>
  },
  {
    title: 'Test',
    dataIndex: 'test',
    key: 'test'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    )
  }
]

const data: DataType[] = [
  {
    key: '1',
    test: 'tes1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    test: 'tes2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    test: 'tes3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

const AllLocationListForm: React.FC<{ locationPanelForm: FormInstance<unknown> }> = ({
  locationPanelForm
}) => {
  const [, setHoverLoc] = useAtom(hoverLocation)
  const [showAllLocationListForm] = useAtom(EditLocationListFormSwitch)
  return (
    <>
      {showAllLocationListForm ? (
        <>
          <div style={{ textAlign: 'end', width: '100%' }}>
            <CloseSquareOutlined className="close-table-icon" />
          </div>
          <Table<DataType>
            columns={columns}
            dataSource={data}
            style={{ backgroundColor: 'rgba(252, 248, 248, 0.1)' }}
          />
        </>
      ) : null}
    </>
  )
}

export default memo(AllLocationListForm)
