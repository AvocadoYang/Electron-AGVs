import { FC, useState } from 'react'
import { Button, Card, Flex, Form, Modal, Popconfirm, Table, Tooltip } from 'antd'
import type { TableProps } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useMutation } from '@tanstack/react-query'
import useCharge from '@renderer/api/useCharge'
import client from '@renderer/api/axiosClient'
import ChargeForm from './ChargeForm'
import FormHr from '@renderer/pages/Setting/utils/FormHr'

type ChargeData = {
  id: string
  active: boolean
  amrIds: string[]
  aggressiveThreshold: number
  fullThreshold: number
  passiveFullThreshold: number
  passiveWaitTime: number
  availableGetTaskThreshold: number
  autoTimeZone: string
  titleId: string
  title: string
}

type FormData = {
  id: string
  amrIds: string[]
  taskId: string
  aggressiveThreshold: number
  fullThreshold: number
  activeIdle: boolean
  passiveFullThreshold: number
  passiveWaitTime: number
  availableGetTaskThreshold: number
  activeAuto: boolean
  autoTimeZone: number
}

const BtnBox = styled.div`
  width: 3em;
`

const Svg = styled.svg`
  //why this is not work?
  & :hover {
    background-color: #ff2929;
  }
`

const ActiveBox = styled.div`
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
  background-color: ${(prop) => (prop.$active ? '#2bea00' : '#ff1818')};
`

const ChargePanel: FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { data, refetch } = useCharge()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [selectKey, setSelectKey] = useState('')

  const showModal = (id: string) => {
    setSelectKey(id)
    setOpen(true)
  }

  const saveMutation = useMutation({
    mutationFn: (payload: FormData) => {
      return client.post(`api/setting/save-charge-mission`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const handleSave = () => {
    const payload = form.getFieldsValue() as FormData

    const newPayload = {
      ...payload,
      id: selectKey
    }

    saveMutation.mutate(newPayload)

    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const addMutation = useMutation({
    mutationFn: () => {
      return client.post(`api/setting/add-charge-mission`)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const activeMutation = useMutation({
    mutationFn: (payload: { active: boolean; id: string; amrId: string[] }) => {
      return client.post(`api/setting/active-charge-mission`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string; amrId: string[] }) => {
      return client.post(`api/setting/delete-charge-mission`, payload)
    },
    onSuccess() {
      // eslint-disable-next-line no-void
      void refetch()
    }
  })

  const handleAdd = () => {
    addMutation.mutate()
  }

  const handleActive = (event: boolean, id: string, amrId: string[]) => {
    activeMutation.mutate({ active: event, id, amrId })
  }

  const handleDelete = (id: string, amrId: string[]) => {
    deleteMutation.mutate({ id, amrId })
  }

  const columns: TableProps<ChargeData>['columns'] = [
    {
      title: t('charge.active'),
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (_v, record) => {
        return (
          <ActiveBox>
            <Dot $active={record.active} />{' '}
            <>
              {record.active === true
                ? t('mission.charge_mission.executing')
                : t('mission.charge_mission.stale')}
            </>
          </ActiveBox>
        )
      }
    },
    {
      title: t('charge.name'),
      dataIndex: 'name',
      key: 'name',
      render(_, record) {
        return <>{record.title}</>
      }
    },
    {
      title: t('charge.amrId'),
      dataIndex: 'amrId',
      key: 'amrId',
      render(_, record) {
        return <>{record.amrIds}</>
      }
    },
    {
      title: t('charge.aggressive'),
      dataIndex: 'aggressive',
      key: 'aggressive',
      render(_, record) {
        return <>{record.aggressiveThreshold}</>
      }
    },
    {
      title: t('charge.full_rate'),
      dataIndex: 'fullThreshold',
      key: 'fullThreshold',
      render(_, record) {
        return <>{record.fullThreshold}</>
      }
    },
    {
      title: t('charge.available_get_task'),
      dataIndex: 'aggressiveThreshold',
      key: 'aggressiveThreshold',
      render(_, record) {
        return <>{record.aggressiveThreshold}</>
      }
    },

    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render(_, record) {
        return (
          <>
            <Tooltip title={t('utils.edit')} placement="right">
              <Svg
                onClick={() => showModal(record.id)}
                width={18}
                fill="#0ca2ff"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M10 20H6V4H13V9H18V12.1L20 10.1V8L14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H10V20M20.2 13C20.3 13 20.5 13.1 20.6 13.2L21.9 14.5C22.1 14.7 22.1 15.1 21.9 15.3L20.9 16.3L18.8 14.2L19.8 13.2C19.9 13.1 20 13 20.2 13M20.2 16.9L14.1 23H12V20.9L18.1 14.8L20.2 16.9Z" />
              </Svg>
            </Tooltip>

            {record.active ? (
              <>
                <Tooltip placement="right" title={t('utils.inactive')}>
                  <Svg
                    onClick={() => handleActive(false, record.id, record.amrIds)}
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
                <Tooltip placement="right" title={t('utils.active')}>
                  <Svg
                    onClick={() => handleActive(true, record.id, record.amrIds)}
                    fill="#01c138"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </Svg>
                </Tooltip>
              </>
            )}

            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id, record.amrIds)}
            >
              <Svg fill="#ff3838" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
              </Svg>
            </Popconfirm>
          </>
        )
      }
    }
  ]

  return (
    <>
      <div>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('mission.charge_mission.charge_mission')}
        </h3>
        <FormHr sortableId={sortableId} />

        <Flex gap="middle" justify="flex-start" align="start" vertical>
          <BtnBox onClick={() => handleAdd()}>
            <Button type="primary">{t('utils.add')}</Button>
          </BtnBox>

          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={data as ChargeData[]}
          />
        </Flex>
      </div>
      <Modal
        width={900}
        title={t('mission.charge_mission.charge_mission')}
        open={open}
        onOk={() => handleSave()}
        onCancel={handleCancel}
      >
        <ChargeForm form={form} selectKey={selectKey} />
      </Modal>
    </>
  )
}

export default ChargePanel
