import { Button, Form, message, Modal, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import OutputFrom from './OutputFrom';
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
import InputFrom from './InputFrom';
import client from '@renderer/api/axiosClient';
import { errorHandler } from '@renderer/utils/utils';
import { ErrorResponse } from '@renderer/utils/globalType';
import { useMutation } from '@tanstack/react-query';
import useLocationScriptInfo from '@renderer/api/useLocationScriptInfo';
import { InputForm, OutputForm } from '@renderer/pages/Simulate/type/common';

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
    mutationFn: (payload: { locationId: string | null }) => {
      return client.post('api/simulate/create-location-info', payload);
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
      setTempOutputFormData(null);
      setTempInputFormData(null);
      refetchInfo();
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const saveMutation = useMutation({
    mutationFn: (payload: { input: InputForm; output: OutputForm }) => {
      return client.post('api/simulate//update-location-info', payload);
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
      clearup();
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const tempSaveData = () => {
    const outData = formOutput.getFieldsValue() as OutputForm;
    const inData = formInput.getFieldsValue() as InputForm;
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
    const inputData = formInput.getFieldsValue() as InputForm;
    const outputData = formOutput.getFieldsValue() as OutputForm;

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

      {isOpening ? (
        <Modal
          title={isLocInfoCreated ? t('sim.modal.edit_info') : t('sim.modal.not_info_yet')}
          open={isOpening}
          onCancel={handleCancel}
          footer={
            isLocInfoCreated ? (
              <Button onClick={handleOk} variant="filled" color="primary" icon={<SaveOutlined />}>
                {t('utils.save')}
              </Button>
            ) : (
              []
            )
          }
        >
          {isLocInfoCreated ? (
            <Tabs defaultActiveKey="1" items={items} />
          ) : (
            <Button
              loading={isLoadingCreate}
              onClick={handleCreate}
              variant="filled"
              color="primary"
            >
              {' '}
              {t('utils.add')}
            </Button>
          )}
        </Modal>
      ) : (
        []
      )}
    </>
  );
};

export default CargoModel;
