import { FC, SetStateAction } from 'react';
import { FormInstance, message, Modal } from 'antd';
import { useCargoMutations } from './hook/useCargoMutations';
import { FormCargo } from './types';
import { useTranslation } from 'react-i18next';
import { Info } from '@renderer/api/type/useLocation';
import CargoMissionForm from './CargoMissionForm';
import LayerForm from './LayerForm';

const CargoModal: FC<{
  id: string;
  locId: string;
  settingForm: FormInstance<unknown>;
  layerForm: FormInstance<unknown>;
  shelfInfo: Info | undefined;
  isEditLayer: boolean;
  isEditModalOpen: boolean;
  setIsEditLayer: (value: SetStateAction<boolean>) => void;
  setIsEditModalOpen: (value: SetStateAction<boolean>) => void;
}> = ({
  id,
  locId,
  settingForm,
  layerForm,
  shelfInfo,
  isEditLayer,
  isEditModalOpen,
  setIsEditModalOpen,
  setIsEditLayer
}) => {
  const [messageApi, contextHolders] = message.useMessage();
  const { editMutation } = useCargoMutations(messageApi);
  const { t } = useTranslation();

  const handleEditOk = () => {
    const payload = settingForm.getFieldsValue() as FormCargo;
    const layerPayload = layerForm.getFieldsValue() as [];

    layerForm.resetFields();
    setIsEditLayer(false);

    const mis = {
      id,
      loc: locId,
      name: payload.name || '',
      region: payload.region,
      directionId: payload.yaw,
      loadId: payload.load,
      offloadId: payload.offload,
      layer: { ...layerPayload, isEditLayer }
    };

    editMutation.mutate(mis);
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      {contextHolders}

      {isEditModalOpen ? (
        <Modal
          title={
            <span
              style={{ fontSize: '1.5em', fontWeight: 'bold' }}
            >{`${t('shelf.shelf')} ${locId}`}</span>
          }
          open={isEditModalOpen}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          width={1530}
          styles={{
            body: { padding: '24px', background: '#fafafa' }
          }}
          okButtonProps={{
            size: 'large',
            type: 'primary',
            style: { background: '#1890ff', borderRadius: 6 }
          }}
          cancelButtonProps={{ size: 'large', style: { borderRadius: 6 } }}
          style={{ top: 20 }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <CargoMissionForm locId={locId} form={settingForm} locName={shelfInfo?.name || ''} />
            {shelfInfo === undefined ? (
              <div style={{ color: '#ff4d4f', fontWeight: 'bold', padding: '16px' }}>
                {t('utils.error')}
              </div>
            ) : (
              <LayerForm
                layer={shelfInfo.layer as Info[]}
                locId={locId}
                form={layerForm}
                setIsEditLayer={setIsEditLayer}
              />
            )}
          </div>
        </Modal>
      ) : (
        []
      )}
    </>
  );
};

export default CargoModal;
