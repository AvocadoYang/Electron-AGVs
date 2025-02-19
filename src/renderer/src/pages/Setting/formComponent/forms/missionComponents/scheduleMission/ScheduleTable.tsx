/* eslint-disable no-void */
import dayjs from 'dayjs'
import { Dispatch, FC, SetStateAction } from 'react'
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import styled from 'styled-components'
import { Button, Col, FormInstance, Popconfirm, Row, Table, Tooltip, message } from 'antd'
import { nanoid } from 'nanoid'
import { useTranslation } from 'react-i18next'
import client from '@renderer/api/axiosClient'
import useSchedule from '@renderer/api/useSchedule'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'

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
  active: boolean
  amrId?: string[]
  schedule: string
  missionId?: string
  missionName: string
}

const TimeStyle = styled.div`
  display: flex;
  flex-direction: column;
`

const ScheduleTable: FC<{
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  form: FormInstance<unknown>
  setSelectId: Dispatch<SetStateAction<string | null>>
}> = ({ form, setIsModalOpen, setSelectId }) => {
  const { t } = useTranslation()
  const { data: schedule, refetch } = useSchedule()

  const [messageApi, contextHolder] = message.useMessage()

  const numberToDigitsArray = (num: string): number[] => {
    return num.split('').map((digit) => parseInt(digit, 10))
  }

  const activeMutation = useMutation({
    mutationFn: (payload: { id: string; isActive: boolean }) => {
      return client.post(`api/setting/active-schedule`, payload)
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const addMutation = useMutation({
    mutationFn: () => {
      return client.post(`api/setting/add-schedule`)
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const handleAdd = () => {
    addMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post(`api/setting/remove-schedule`, payload)
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

  const handleEdit = (id: string) => {
    if (!schedule) return
    setIsModalOpen(true)
    setSelectId(id)

    const data = schedule.find((v) => v.id === id)

    const [day, min, sec] = data?.schedule.split('-') as string[]

    const week = numberToDigitsArray(day)
    const time = dayjs(`${min}:${sec}`, 'HH:mm')

    form.setFieldValue('amrId', data?.amrId)
    form.setFieldValue('missionId', data?.missionId)
    form.setFieldValue('day', week)
    form.setFieldValue('time', time)
  }

  const columns = [
    {
      title: t('mission.schedule_mission.status'),
      key: 'active',
      dataIndex: 'active',
      width: 100,
      render: (_v: unknown, record: DataType) => {
        return (
          <ActiveBox>
            <Dot $active={record.active as boolean} />{' '}
            <>
              {record.active
                ? t('mission.schedule_mission.executing')
                : t('mission.schedule_mission.stale')}
            </>
          </ActiveBox>
        )
      }
    },
    {
      title: t('mission.schedule_mission.car'),
      dataIndex: 'amrId',
      key: 'amrId',
      width: 150,
      editable: true
    },
    {
      title: t('mission.schedule_mission.what_time'),
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      editable: true,
      sorter: (a: DataType, b: DataType) => {
        const [weekA, hourA, minusA] = a.schedule.split('-')
        const [weekB, hourB, minusB] = b.schedule.split('-')
        return Number(hourA) - Number(hourB)
      },
      render: (_v: unknown, record: DataType) => {
        const [week, hour, minus] = record.schedule.split('-')

        return (
          <TimeStyle>
            <span>{`星期: ${week}`}</span>
            <span>{`${hour}:${minus}`}</span>
          </TimeStyle>
        )
      }
    },
    {
      title: t('mission.schedule_mission.mission'),
      dataIndex: 'missionName',
      key: 'missionName',
      width: 300,
      sorter: (a: DataType, b: DataType) => a.missionName.localeCompare(b.missionName),
      editable: true,
      render: (_v: unknown, record: DataType) => {
        return record.missionName
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
                <Tooltip placement="right" title={t('mission.schedule_mission.stale')}>
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
                <Tooltip placement="right" title={t('mission.schedule_mission.executing')}>
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
              <Col className="gutter-row" span={12}>
                <Tooltip placement="right" title={t('utils.edit')}>
                  <EditTwoTone twoToneColor="#33bcb7" onClick={() => handleEdit(record.id)} />
                </Tooltip>
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
      <Button onClick={() => handleAdd()}>{t('utils.add')}</Button>
      <Table rowKey={() => nanoid()} columns={columns} dataSource={schedule as DataType[]} />
    </Wrapper>
  )
}

export default ScheduleTable
