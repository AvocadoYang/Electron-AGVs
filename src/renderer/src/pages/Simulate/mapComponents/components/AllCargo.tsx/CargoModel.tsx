import { Button, Form, message, Modal, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import OutputFrom from './OutputFrom';
import InputFrom from './InputFrom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  inputFormData,
  isOpenCargoModal,
  isSelectCargo,
  outputFormData,
  selectedLocation,
  targetKeyJotai
} from '@renderer/pages/Simulate/utils/status';
import { FC, useEffect } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import client from '@renderer/api/axiosClient';
import { errorHandler } from '@renderer/utils/utils';
import { ErrorResponse } from '@renderer/utils/globalType';
import { useMutation } from '@tanstack/react-query';
import useLocationScriptInfo from '@renderer/api/useLocationScriptInfo';
import styled from 'styled-components';
import { InputForm, OutputForm } from '@renderer/pages/Simulate/type/common';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    background: linear-gradient(135deg, #ffffff, #f9f9f9);
  }
  .ant-modal-header {
    border-bottom: none;
    padding-bottom: 0;
  }
  .ant-modal-title {
    font-size: 1.5em;
    font-weight: 600;
    color: #1f2a44;
  }
  .ant-modal-footer {
    border-top: none;
    padding-top: 10px;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 20px;
  }
  .ant-tabs-tab {
    padding: 10px 20px;
    font-weight: 500;
    color: #595959;
  }
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1890ff !important;
  }
  .ant-tabs-ink-bar {
    background: #1890ff;
    height: 3px;
  }
`;

const SaveButton = styled(Button)`
  background: #1890ff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  transition: all 0.3s ease;
  &:hover {
    background: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
`;

const CreateButton = styled(Button)`
  background: #52c41a;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  transition: all 0.3s ease;
  &:hover {
    background: #73d13d;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
  }
`;

const CargoModel: FC = () => {
  const [formOutput] = Form.useForm();
  const [formInput] = Form.useForm();
  const { t } = useTranslation();
  const setIsSelecting = useSetAtom(isSelectCargo);
  const [isOpening, setIsOpening] = useAtom(isOpenCargoModal);
  const selectLocation = useAtomValue(selectedLocation);
  const setTargetKey = useSetAtom(targetKeyJotai);
  const [messageApi, contextHolder] = message.useMessage();
  const setTempOutputFormData = useSetAtom(outputFormData);
  const setTempInputFormData = useSetAtom(inputFormData);
  const {
    data: locInfo,
    refetch: refetchInfo,
    isLoading: isLoadingCreate
  } = useLocationScriptInfo(selectLocation);

  const isLocInfoCreated = locInfo?.input?.id !== undefined && locInfo?.output?.id !== undefined;

  const createMutation = useMutation({
    mutationFn: (payload: { locationId: string | null }) =>
      client.post('api/simulate/create-location-info', payload),
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
      setTempOutputFormData(null);
      setTempInputFormData(null);
      refetchInfo();
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const saveMutation = useMutation({
    mutationFn: (payload: { input: any; output: any }) =>
      client.post('api/simulate/update-location-info', payload),
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
      clearup();
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const tempSaveData = () => {
    const outData = formOutput.getFieldsValue();
    const inData = formInput.getFieldsValue();
    setIsOpening(false);
    setIsSelecting(true);
    setTempOutputFormData(outData);
    setTempInputFormData(inData);
  };

  const handleCancel = () => {
    setIsSelecting(false);
    setIsOpening(false);
    setTempOutputFormData(null);
    setTempInputFormData(null);
    setTargetKey([]);
  };

  const handleOk = () => {
    const inputData = formInput.getFieldsValue();
    const outputData = formOutput.getFieldsValue();
    const payload = {
      inputId: locInfo?.input?.id,
      outputId: locInfo?.output?.id,
      input: inputData,
      output: outputData
    };
    saveMutation.mutate(payload);
  };

  const clearup = () => {
    setIsSelecting(false);
    setIsOpening(false);
    setTempOutputFormData(null);
    setTempInputFormData(null);
    setTargetKey([]);
  };

  const handleCreate = () => {
    createMutation.mutate({ locationId: selectLocation });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('sim.cargo.output.output'),
      children: <OutputFrom form={formOutput} tempSaveData={tempSaveData} />
    },
    {
      key: '2',
      label: t('sim.cargo.input.input'),
      children: <InputFrom form={formInput} />
    }
  ];

  useEffect(() => {
    if (isLocInfoCreated) {
      setTempOutputFormData(locInfo?.output as OutputForm);
      setTempInputFormData(locInfo?.input as InputForm);
    }
  }, [locInfo]);

  return (
    <>
      {contextHolder}
      <StyledModal
        title={isLocInfoCreated ? t('sim.modal.edit_info') : t('sim.modal.not_info_yet')}
        open={isOpening}
        onCancel={handleCancel}
        footer={
          isLocInfoCreated ? (
            <SaveButton onClick={handleOk} icon={<SaveOutlined />}>
              {t('utils.save')}
            </SaveButton>
          ) : null
        }
        transitionName="ant-fade"
      >
        {isLocInfoCreated ? (
          <StyledTabs defaultActiveKey="1" items={items} />
        ) : (
          <CreateButton loading={isLoadingCreate} onClick={handleCreate}>
            {t('utils.add')}
          </CreateButton>
        )}
      </StyledModal>
    </>
  );
};

export default CargoModel;
