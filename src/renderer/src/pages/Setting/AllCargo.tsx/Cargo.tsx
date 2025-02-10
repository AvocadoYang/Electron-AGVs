/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, message } from 'antd'
import { FC, memo, useCallback, useState } from 'react'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { LocWithoutArr, WrapperType } from './types'
import styled from 'styled-components'
import { useCargoMutations } from './hook/useCargoMutations'
import CargoDisplay from './CargoDisplay'
import CargoModal from './CargoModal'
import { LoadingStation } from './LoadingStation'
import useCargoInfo from '@renderer/sockets/useCargoInfo'
import { cargoStyle } from '@renderer/utils/gloable'
import useLoc from '@renderer/api/useLoc'

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

const MemoizedCargo = memo(CargoDisplay, (prevProps, nextProps) => {
  return (
    prevProps.level == nextProps.level &&
    prevProps.levelName == nextProps.levelName &&
    prevProps.cargoValue == nextProps.cargoValue &&
    prevProps.isOccupy == nextProps.isOccupy &&
    prevProps.isDisable == nextProps.isDisable &&
    prevProps.rotate == nextProps.rotate
  )
})

const Cargo: FC<AllCargoProps> = ({ locId }) => {
  const [settingForm] = Form.useForm()
  const [layerForm] = Form.useForm()
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditLayer, setIsEditLayer] = useState(false)
  const cStyle = useAtomValue(cargoStyle)
  const { editColumnMutation } = useCargoMutations(messageApi)
  const shelfInfo = useCargoInfo(locId)
  const { data: locInfo } = useLoc(locId)

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, targetId: string, targetLevel: number) => {
      if (event.button !== 1) return
      editColumnMutation.mutate({ locationId: targetId, level: targetLevel })
    },
    [editColumnMutation]
  )

  const targetStyle = cStyle.find((item) => item.locationId === locId) as LocWithoutArr

  if (!shelfInfo) return <LoadingStation />

  return (
    <>
      {contextHolder}
      <Wrapper
        translateX={(locInfo as LocWithoutArr)?.translateX}
        translateY={(locInfo as LocWithoutArr)?.translateY}
        scale={(locInfo as LocWithoutArr)?.scale}
        rotate={(locInfo as LocWithoutArr)?.rotate}
        onClick={() => {
          setIsEditModalOpen(true)
        }}
      >
        {' '}
        {shelfInfo?.layer?.map((cargo, index: number) => {
          const level = index
          const nameLevel = cargo[level]?.levelName || ''
          const cargoValue = cargo[level]?.cargo.hasCargo || false
          const borderColor = (
            cargo[level]?.pallet?.color !== null ? cargo[level]?.pallet?.color : '#c7c7c7'
          ) as string

          const isOccupy = cargo[level]?.booked
          const isDisable = cargo[level]?.disable

          const isForbidden = isOccupy || isDisable

          const canClick = !isForbidden

          return (
            <MemoizedCargo
              level={level}
              levelName={nameLevel}
              cargoValue={cargoValue}
              isOccupy={isOccupy}
              isDisable={isDisable}
              border={borderColor}
              locId={locId}
              rotate={targetStyle?.rotate || 0}
              canClick={canClick}
              handleMouseDown={(e) => handleMouseDown(e, locId, level)}
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

export default Cargo
