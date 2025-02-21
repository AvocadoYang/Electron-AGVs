import { Button, Table } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { FormatPainterOutlined } from '@ant-design/icons'

import { useAtom, useSetAtom } from 'jotai'
import useAllChargeStation, { SingleChargeStation } from '@renderer/api/useAllCharge'
import FormHr from '@renderer/pages/Setting/utils/FormHr'
import SettingChargeStationStyleForm from './SettingChargeStationStyleForm'
import { chargeStationEditData, isEditChargeStation } from '@renderer/utils/gloable'

const ChargeStationStylePanel: FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { t } = useTranslation()
  const { data } = useAllChargeStation()

  const setSelectStation = useSetAtom(chargeStationEditData)
  const [isEditStation, setIsEditStation] = useAtom(isEditChargeStation)
  const handleEdit = (loc: number) => {
    if (!data) return
    const targetIndex = data.findIndex((a) => a?.locationId === loc)

    if (targetIndex === -1) {
      setSelectStation(null)
      return
    }

    setSelectStation({
      loc: data[targetIndex]?.locationId || 0,
      translateX: data[targetIndex]?.translateX || 0,
      translateY: data[targetIndex]?.translateY || 0,
      rotate: data[targetIndex]?.rotate || 270,
      scale: data[targetIndex]?.scale || 1
    })

    setIsEditStation(true)
  }

  const columns = [
    {
      title: t('other.edit_mission_tag.location'),
      dataIndex: 'locationId',
      key: 'locationId'
    },
    {
      title: 'x',
      dataIndex: 'x',
      key: 'x'
    },
    {
      title: 'y',
      dataIndex: 'y',
      key: 'y'
    },
    {
      title: 'translateX',
      dataIndex: 'translateX',
      key: 'translateX'
    },
    {
      title: 'translateY',
      dataIndex: 'translateY',
      key: 'translateY'
    },
    {
      title: 'rotate',
      dataIndex: 'rotate',
      key: 'rotate'
    },
    {
      title: 'scale',
      dataIndex: 'scale',
      key: 'scale'
    },
    {
      title: t('other.edit_charge_station_icon_style.edit_position'),
      dataIndex: 'operation',
      key: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_v: unknown, record: SingleChargeStation) => {
        return (
          <Button
            icon={<FormatPainterOutlined />}
            onClick={() => handleEdit(record.locationId)}
            color="primary"
            variant="filled"
          >
            {t('other.edit_charge_station_icon_style.edit_position')}
          </Button>
        )
      }
    }
  ]

  return (
    <div>
      <h3 className="drop_button_style" {...listeners} {...attributes}>
        {t('toolbar.others.edit_charge_station_icon_style')}
      </h3>
      <FormHr sortableId={sortableId} />

      {isEditStation ? (
        <SettingChargeStationStyleForm />
      ) : (
        <Table
          dataSource={data as SingleChargeStation[]}
          columns={columns as []}
          rowKey={(record: SingleChargeStation) => record.locationId}
        />
      )}
    </div>
  )
}

export default ChargeStationStylePanel
