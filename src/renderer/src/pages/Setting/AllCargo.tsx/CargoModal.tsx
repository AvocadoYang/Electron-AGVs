import { FC, SetStateAction } from 'react'
import { FormInstance, message, Modal } from 'antd'
import { useCargoMutations } from './hook/useCargoMutations'
import styled from 'styled-components'
import { FormCargo } from './types'
import { useTranslation } from 'react-i18next'
import { Info } from '@renderer/api/type/useLocation'
import CargoMissionForm from './CargoMissionForm'
import LayerForm from './LayerForm'

const FormWrapper = styled.div`
  display: flex;
`

const CargoModal: FC<{
  locId: string
  settingForm: FormInstance<unknown>
  layerForm: FormInstance<unknown>
  shelfInfo: Info | undefined
  isEditLayer: boolean
  isEditModalOpen: boolean
  setIsEditLayer: (value: SetStateAction<boolean>) => void
  setIsEditModalOpen: (value: SetStateAction<boolean>) => void
}> = ({
  locId,
  settingForm,
  layerForm,
  shelfInfo,
  isEditLayer,
  isEditModalOpen,
  setIsEditModalOpen,
  setIsEditLayer
}) => {
  const [messageApi, contextHolders] = message.useMessage()
  const { editMutation } = useCargoMutations(messageApi)
  const { t } = useTranslation()
  const handleEditOk = () => {
    const payload = settingForm.getFieldsValue() as FormCargo
    const layerPayload = layerForm.getFieldsValue() as []

    layerForm.resetFields()
    setIsEditLayer(false)

    const mis = {
      loc: locId,
      name: payload.name || '',
      region: payload.region,
      directionId: payload.yaw,
      loadId: payload.load,
      offloadId: payload.offload,
      layer: { ...layerPayload, isEditLayer }
    }

    editMutation.mutate(mis)
    setIsEditModalOpen(false)
  }

  const handleEditCancel = () => {
    setIsEditModalOpen(false)
  }

  return (
    <>
      {contextHolders}
      <Modal
        title={`${t('shelf.shelf')} ${locId}`}
        open={isEditModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        width={1530}
      >
        <FormWrapper>
          <CargoMissionForm // 設定頁面
            locId={locId}
            form={settingForm}
            locName={shelfInfo?.name || ''} // todo fix the myLoc.info.name will be undefined issue
          />
          {shelfInfo === undefined ? (
            'error'
          ) : (
            <LayerForm
              layer={shelfInfo.layer as Info[]}
              locId={locId}
              form={layerForm}
              setIsEditLayer={setIsEditLayer}
            />
          )}
        </FormWrapper>
      </Modal>
    </>
  )
}

export default CargoModal
