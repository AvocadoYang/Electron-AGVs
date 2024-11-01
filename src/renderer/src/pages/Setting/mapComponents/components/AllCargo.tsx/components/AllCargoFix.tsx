/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, message } from 'antd'
import { FC, memo, useCallback, useState } from 'react'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import {
  isEditCargo,
  cargoStatus,
  assignType,
  assignPayload,
  cargoStyle
} from '~/configs/globalState'
import { FormCargo, WrapperType } from '../types'
import { useCargoCalculations } from '../hook/useCargoCalculations'
import useShelf from '~/api/useShelf'
import styled from 'styled-components'
import { useCargoMutations } from '../hook/useCargoMutations'
import useLoc, { LocWithoutArr } from '~/api/useLoc'
import CargoDisplay from './CargoDisplay'
import useCargoInfo from '~/socket/useCargoInfo'
import CargoModal from '../CargoModal'

interface AllCargoProps {
  locId: string
}

const Wrapper = styled.div<WrapperType>`
  /* width: 50px; */
  position: relative;
  z-index: 20;
  /* height: 10px; */
  border-radius: 3px;
  display: flex;
  gap: 0.2px;
  flex-direction: row;
  border-radius: 1px;
  transform: ${(props) =>
    `translate(${props.translateX}em, ${props.translateY}em) scale(${props.scale}) rotate(${props.rotate}deg)`};
`

const Homie: FC<{ areaId?: string }> = ({ areaId }) => {
  return <p>{areaId}</p>
}

const MemoHomie = memo(Homie, (prevProps, nextProps) => {
  return prevProps.areaId == nextProps.areaId
})

const MemoizedCargo = memo(CargoDisplay, (prevProps, nextProps) => {
  return (
    prevProps.level == nextProps.level &&
    prevProps.levelName == nextProps.levelName &&
    prevProps.cargoValue == nextProps.cargoValue &&
    prevProps.isOccupy == nextProps.isOccupy &&
    prevProps.isAssign == nextProps.isAssign &&
    prevProps.rotate == nextProps.rotate
  )
})

const AllCargoFix: FC<AllCargoProps> = ({ locId }) => {
  const [settingForm] = Form.useForm<FormCargo>()
  const [layerForm] = Form.useForm()
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditLayer, setIsEditLayer] = useState(false)

  const [isEdit] = useAtom(isEditCargo)
  const [cStatus, setCState] = useAtom(cargoStatus)
  const [AType] = useAtom(assignType)
  const [APL, setAssignPayload] = useAtom(assignPayload)
  const { data: shelf } = useShelf()
  const { data: locInfo } = useLoc(locId)
  const [cStyle] = useAtom(cargoStyle)

  const { editColumnMutation } = useCargoMutations(messageApi)

  const shelfInfo = useCargoInfo(locId)

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, targetId: string, targetLevel: number) => {
      if (event.button !== 1) return
      editColumnMutation.mutate({ locationId: targetId, level: targetLevel })
    },
    [editColumnMutation]
  )

  const handleAssignColumn = useCallback(
    (columnName: string, level: number) => {
      if (cStatus !== 'assign') return

      const region = shelf?.find((v) => v.Loc.loc === locId)?.Loc.region
      const fullColumnName = region ? `${region}${columnName}` : columnName

      const updateAssignPayload = (missionType: 'load' | 'offload' | 'normal') => {
        const payload = {
          locationId: locId,
          missionType,
          columnName: fullColumnName,
          level
        }

        const targetIndex = APL.findIndex((a) => a.missionType === missionType)
        if (targetIndex === -1) {
          setAssignPayload((prev) => [...prev, payload])
        } else {
          const updatedPayloads = [...APL]
          updatedPayloads[targetIndex] = {
            ...updatedPayloads[targetIndex],
            ...payload
          }
          setAssignPayload(updatedPayloads)
        }
      }

      if (AType === 'load') updateAssignPayload('load')
      if (AType === 'offload') updateAssignPayload('offload')

      setCState('main')
    },
    [AType, cStatus, APL, locId, shelf, setAssignPayload, setCState]
  )

  const handleSettingOrMission = () => {
    switch (cStatus) {
      case 'setting':
        setIsEditModalOpen(true)
        break
      case 'main':
        console.log('this function has been deprecated')
        break
      default:
    }
  }

  const isClickable = useCallback(
    (cargoValue: boolean, isOccupy: boolean) => {
      if (cStatus === 'setting' || cStatus === 'main') return true
      if (isOccupy) return false
      return AType === 'load' ? cargoValue : !cargoValue
    },
    [cStatus, AType]
  )

  const targetStyle = cStyle.find((item) => item.loc === locId) as LocWithoutArr

  if (!shelfInfo) return <div>{t('errors')}</div>

  return (
    <>
      {contextHolder}
      <Wrapper
        translateX={isEdit ? targetStyle.translateX : (locInfo as LocWithoutArr)?.translateX}
        translateY={isEdit ? targetStyle.translateY : (locInfo as LocWithoutArr)?.translateY}
        scale={isEdit ? targetStyle.scale : (locInfo as LocWithoutArr)?.scale}
        rotate={isEdit ? targetStyle.rotate : (locInfo as LocWithoutArr)?.rotate}
        onClick={() => {
          handleSettingOrMission()
        }}
      >
        {' '}
        {shelfInfo.layer?.map((cargo, index: number) => {
          const level = index
          const nameLevel = cargo[level]?.levelName || ''
          const cargoValue = cargo[level]?.cargo.hasCargo || false
          const borderColor = (
            cargo[level]?.pallet?.color !== null ? cargo[level]?.pallet?.color : '#c7c7c7'
          ) as string

          const isOccupy = cargo[level]?.booked

          return (
            <MemoizedCargo
              key={locId}
              level={level}
              levelName={nameLevel}
              cargoValue={cargoValue}
              isOccupy={isOccupy}
              isAssign={cStatus === 'assign'}
              border={borderColor}
              locId={locId}
              rotate={isEdit ? targetStyle.rotate : ((locInfo as LocWithoutArr)?.rotate as number)}
              clickable={() => isClickable(cargoValue, isOccupy)}
              handleAssignColumn={handleAssignColumn}
              handleMouseDown={(e) => handleMouseDown(e, locId, level)}
              isShelfDisable={false}
            />
          )
        })}
      </Wrapper>

      <CargoModal
        locId={locId}
        settingForm={settingForm}
        layerForm={layerForm}
        shelfInfo={shelfInfo}
        isEditLayer={isEditLayer}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsEditLayer={setIsEditLayer}
      />
    </>
  )
}

export default AllCargoFix
