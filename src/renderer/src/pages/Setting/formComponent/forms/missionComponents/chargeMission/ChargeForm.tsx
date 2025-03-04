import { Form, FormInstance, InputNumber, Select } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { array, boolean, number, object, string } from 'yup';
import client from '@renderer/api/axiosClient';
import useAllMissionTitles from '@renderer/api/useMissionTitle';
import useName from '@renderer/api/useAmrName';
import GlobalLoading from '@renderer/utils/GlobalLoading';

const getSelectedCharge = async (id: string) => {
  const { data } = await client.get<unknown>(`api/setting/selected-charge?id=${id}`);

  const schema = () =>
    object({
      id: string().required(),
      active: boolean().optional().nullable(),
      amrIds: array(string().optional()).optional(),
      aggressiveThreshold: number().optional().nullable(),
      fullThreshold: number().optional().nullable(),
      passiveFullThreshold: number().optional().nullable(),
      passiveWaitTime: number().optional().nullable(),
      availableGetTaskThreshold: number().optional().nullable(),
      autoTimeZone: string().optional().nullable(),
      missionTitleId: string().optional().nullable()
    }).required();

  return schema().validate(data, { stripUnknown: true });
};

const ChargeForm: FC<{ form: FormInstance<unknown>; selectKey: string }> = ({
  form,
  selectKey
}) => {
  const { data: selectedCharge, isLoading } = useQuery(
    ['select-charge', selectKey],
    () => getSelectedCharge(selectKey),
    {
      enabled: !!selectKey // Prevent fetching when selectKey is not set
    }
  );
  const { data: missionTitle } = useAllMissionTitles();
  const { t } = useTranslation();

  const { data: name } = useName();
  const AmrOption = name?.map((v) => ({ value: v.id, label: v.id }));

  const taskOption = missionTitle?.map((v) => {
    return { value: v.id, label: v.name };
  });

  useEffect(() => {
    if (!selectKey || !selectedCharge) return;

    form.setFieldValue('amrId', selectedCharge?.amrIds);
    form.setFieldValue('taskId', selectedCharge.missionTitleId);
    form.setFieldValue('aggressiveThreshold', selectedCharge?.aggressiveThreshold);
    form.setFieldValue('fullThreshold', selectedCharge?.fullThreshold);
    form.setFieldValue('availableGetTaskThreshold', selectedCharge?.availableGetTaskThreshold);
  }, [form, selectKey, selectedCharge]);

  if (isLoading) return <GlobalLoading />;
  return (
    <Form
      style={{
        width: '100%',
        maxWidth: '1000px', // Adjust max width as needed
        overflow: 'auto' // Enable scrolling for content overflow
      }}
      form={form}
      labelCol={{ span: 6 }}
    >
      <Form.Item label={t('charge.amrId')} name="amrId">
        <Select mode="multiple" options={AmrOption} />
      </Form.Item>

      <Form.Item label={t('charge.name')} name="taskId">
        <Select options={taskOption} />
      </Form.Item>

      <Form.Item label={t('charge.aggressive')} name="aggressiveThreshold">
        <InputNumber max={70} />
      </Form.Item>

      <Form.Item label={t('charge.full_rate')} name="fullThreshold">
        <InputNumber min={70} />
      </Form.Item>

      <Form.Item label={t('charge.available_get_task')} name="availableGetTaskThreshold">
        <InputNumber min={11} />
      </Form.Item>
    </Form>
  );
};

export default ChargeForm;
