/* eslint-disable no-void */
import { Button, Flex, Popconfirm, Table, TableProps, message } from 'antd'
import { FC } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { PoweroffOutlined } from '@ant-design/icons'
import client from '@renderer/api/axiosClient'
import { errorHandler } from '@renderer/utils/utils'
import { ErrorResponse } from '@renderer/utils/globalType'
import { useCycleMission } from '@renderer/sockets/useCycleMission'
import FormHr from '@renderer/pages/Setting/utils/FormHr'
import CycleForm from './CycleForm'

const NotActive = styled.div`
  /* HTML: <div class="loader"></div> */

  min-width: 65px;
  min-height: 65px;
`

const ActiveLogo = styled.div`
  /* HTML: <div class="loader"></div> */
  min-width: 65px;
  width: 65px;
  aspect-ratio: 1;
  --g: radial-gradient(
      farthest-side,
      #0000 calc(95% - 3px),
      #755757 calc(100% - 3px) 98%,
      #0000 101%
    )
    no-repeat;
  background: var(--g), var(--g), var(--g);
  background-size: 30px 30px;
  animation: l10 1.5s infinite;

  @keyframes l10 {
    0% {
      background-position:
        0 0,
        0 100%,
        100% 100%;
    }
    25% {
      background-position:
        100% 0,
        0 100%,
        100% 100%;
    }
    50% {
      background-position:
        100% 0,
        0 0,
        100% 100%;
    }
    75% {
      background-position:
        100% 0,
        0 0,
        0 100%;
    }
    100% {
      background-position:
        100% 100%,
        0 0,
        0 100%;
    }
  }
`

const MinWid = styled.div`
  min-width: 12em;
`

type CM = {
  isActive: boolean
  amrId?: string
  missionName: string
  cycle_relate_id: string
  mission_id: string
}

const CycleMissionPanel: FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { t } = useTranslation()
  const data = useCycleMission()
  const [messageApi, contextHolder] = message.useMessage()
  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post(
        'api/setting/delete-cycle-mission',
        {
          cycle_id: payload.id
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem('_KMT')}` }
        }
      )
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const activeMutation = useMutation({
    mutationFn: (payload: { id: string; isActive: boolean }) => {
      return client.post(
        'api/setting/active-cycle-mission',
        {
          cycle_id: payload.id,
          isActive: payload.isActive
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem('_KMT')}` }
        }
      )
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'))
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })

  const activeSwitch = (id: string, isActive: boolean) => {
    activeMutation.mutate({ id, isActive })
  }

  const deleteOne = (id: string) => {
    deleteMutation.mutate({ id })
  }

  const columns: TableProps<CM>['columns'] = [
    {
      title: t('mission.cycle_mission.random'),
      dataIndex: 'missionName',
      key: 'missionName'
    },
    {
      title: t('mission.cycle_mission.car'),
      dataIndex: 'amrId',
      key: 'amrId',
      render(_, record) {
        return record.amrId ? record.amrId : t('mission.cycle_mission.random')
      }
    },
    {
      title: t('mission.cycle_mission.status'),
      dataIndex: 'status',
      key: 'status',
      render(_, record) {
        return record.isActive ? <ActiveLogo /> : <NotActive />
      }
    },
    {
      key: 'action',
      render: (_, record) => (
        <MinWid>
          <Flex gap="middle">
            <Button
              type={record ? 'primary' : 'default'}
              icon={<PoweroffOutlined />}
              loading={activeMutation.isLoading}
              onClick={() => activeSwitch(record.cycle_relate_id, !record.isActive)}
            >
              {record.isActive
                ? t('mission.cycle_mission.stale')
                : t('mission.cycle_mission.executing')}
            </Button>
            {record.isActive ? (
              []
            ) : (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => deleteOne(record.cycle_relate_id)}
              >
                <Button loading={deleteMutation.isLoading} type="dashed" danger>
                  {t('utils.delete')}
                </Button>
              </Popconfirm>
            )}
          </Flex>
        </MinWid>
      )
    }
  ]

  return (
    <>
      {contextHolder}
      <div>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('mission.cycle_mission.cycle_mission')}
        </h3>
        <FormHr sortableId={sortableId} />

        <Flex gap="middle" justify="flex-start" align="start" vertical>
          <CycleForm />
          <Table
            rowKey={(record) => record?.cycle_relate_id as string}
            columns={columns as []}
            dataSource={data}
            pagination={{ pageSize: 4 }}
          />
        </Flex>
      </div>
    </>
  )
}

export default CycleMissionPanel
