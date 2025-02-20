/* eslint-disable no-void */
import { FC } from 'react'
import { Popconfirm, Skeleton, Table, Tooltip, message } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useMutation } from '@tanstack/react-query'
import useBLCS from '@renderer/api/useBeforeleftChargeStation'
import client from '@renderer/api/axiosClient'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'

interface DataType {
  id: string
  active: boolean
  amrId: string[]
  missionId: string
  name: string
}

const Svg = styled.svg`
  //why this is not work?
  & :hover {
    background-color: #ff2929;
  }
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

const AmrBox = styled.div`
  display: flex;
  flex-direction: column;
`

const AmrText = styled.span`
  margin: 0;
  padding: 0;
  color: #4d4d4d;
`

const BeforeLeftChargeStationTable: FC = () => {
  const { data, isLoading, refetch } = useBLCS()
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()

  const activeMutation = useMutation({
    mutationFn: (payload: { id: string; isActive: boolean }) => {
      return client.post(`api/setting/active-BLCS`, payload)
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
      void refetch()
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post(`api/setting/delete-BLCS`, payload)
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
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
      title: t('mission.before_left_charge_station_mission.status'),
      key: 'active',
      dataIndex: 'active',
      width: 100,
      render: (_v: unknown, record: DataType) => {
        return (
          <ActiveBox>
            <Dot $active={record.active as boolean} />{' '}
            <>
              {record.active
                ? t('mission.before_left_charge_station_mission.executing')
                : t('mission.before_left_charge_station_mission.stale')}
            </>
          </ActiveBox>
        )
      }
    },
    {
      title: t('mission.before_left_charge_station_mission.mission'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('mission.before_left_charge_station_mission.car'),
      dataIndex: 'amrId',
      key: 'amrId',
      render: (_v: unknown, record: DataType) => {
        const da = record.amrId.map((s, i) => {
          const subName = s.split('-').slice(1).join('-')

          return <AmrText key={`${subName}-${i}`}>{subName}</AmrText>
        })

        return <AmrBox>{da}</AmrBox>
      }
    },
    {
      title: '',
      dataIndex: 'option',
      key: 'option',
      width: 50,
      render: (_v: unknown, record: DataType) => {
        return (
          <>
            {record.active ? (
              <>
                <Tooltip placement="right" title="停止">
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
                <Tooltip placement="right" title="啟動">
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

            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <Svg fill="#ff3838" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
              </Svg>
            </Popconfirm>
          </>
        )
      }
    }
  ]

  if (isLoading) return <Skeleton />
  return (
    <>
      {contextHolder}
      <Table
        rowKey={(record) => record.missionId}
        columns={columns}
        dataSource={data as DataType[]}
      />
    </>
  )
}

export default BeforeLeftChargeStationTable
