/* eslint-disable no-void */
import { FC } from 'react'
import { DeleteTwoTone } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { Col, Popconfirm, Row, Table, Tooltip, message } from 'antd'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import { array, boolean, number, object, string } from 'yup'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'
import client from '@renderer/api/axiosClient'

const getTopic = async () => {
  const { data } = await client.get<unknown>('api/setting/topic-task')

  const schema = () =>
    array(
      object({
        id: string().required(),
        amrId: array(string().required()).required(),
        topicId: number().required(),
        active: boolean().required(),
        taskName: string().required(),
        taskId: string().required()
      }).required()
    ).required()

  return schema().validate(data, { stripUnknown: true })
}

const Svg = styled.svg`
  //why this is not work?
  & :hover {
    background-color: #ff2929;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-start;
`

const ActiveBox = styled.div`
  min-width: 4em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`

type DotStyle = {
  $active: boolean
}

const Dot = styled.div<DotStyle>`
  border-radius: 99%;
  width: 7px;
  height: 7px;
  background-color: ${(prop) => (prop.$active ? '#2bea00' : '#979797')};
`

interface DataType {
  id: string
  amrId: string[]
  topicId: number
  active: boolean
  taskName: string
  taskId: string
}

const TopicTaskTable: FC = () => {
  const { t } = useTranslation()
  const { data: topicData, refetch } = useQuery(['topic-task'], getTopic)

  const [messageApi, contextHolder] = message.useMessage()

  const activeMutation = useMutation({
    mutationFn: (payload: { id: string; isActive: boolean }) => {
      return client.post('api/setting/active-topic-task', payload)
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post('api/setting/delete-topic-task', payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const handleActive = (isActive: boolean, id: string) => {
    activeMutation.mutate({ id, isActive })
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id })
  }

  const columns = [
    {
      title: t('mission.topic_mission.status'),
      key: 'active',
      dataIndex: 'active',
      width: 100,
      render: (_v: unknown, record: DataType) => {
        return (
          <ActiveBox>
            <Dot $active={record.active as boolean} />{' '}
            <>
              {record.active
                ? t('mission.topic_mission.executing')
                : t('mission.topic_mission.stale')}
            </>
          </ActiveBox>
        )
      }
    },
    {
      title: t('mission.topic_mission.car'),
      dataIndex: 'amrId',
      key: 'amrId',
      width: 150,
      render: (_: unknown, record: DataType) => {
        return record.amrId.map((item, i) => {
          return <p key={`${item}-${i}`}>{item} ,</p>
        })
      }
    },
    {
      title: 'Topic Id',
      dataIndex: 'topicId',
      key: 'topicId',
      width: 300,

      render: (_v: unknown, record: DataType) => {
        return record.topicId
      }
    },

    {
      title: t('mission.topic_mission.mission'),
      dataIndex: 'missionName',
      key: 'missionName',
      width: 300,

      render: (_v: unknown, record: DataType) => {
        return record.taskName
      }
    },
    {
      title: '',
      width: 30,
      dataIndex: 'operation',
      key: nanoid(),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(_v: unknown, record: DataType) {
        return (
          <>
            {record.active ? (
              <>
                <Tooltip placement="right" title={t('mission.topic_mission.stale')}>
                  <Svg
                    onClick={() => handleActive(false, record.id)}
                    fill="#ff7b5a"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M9,9H15V15H9" />
                  </Svg>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip placement="right" title={t('mission.topic_mission.executing')}>
                  <Svg
                    onClick={() => handleActive(true, record.id)}
                    fill="#01c138"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </Svg>
                </Tooltip>
              </>
            )}

            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                  <Tooltip placement="right" title={t('utils.delete')}>
                    <DeleteTwoTone twoToneColor="#a61d24" />
                  </Tooltip>
                </Popconfirm>
              </Col>
            </Row>
          </>
        )
      }
    }
  ]

  return (
    <Wrapper>
      {contextHolder}
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={topicData as DataType[]}
      />
    </Wrapper>
  )
}

export default TopicTaskTable
