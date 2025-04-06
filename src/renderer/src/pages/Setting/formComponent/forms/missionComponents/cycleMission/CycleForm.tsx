import client from '@renderer/api/axiosClient';
import useName from '@renderer/api/useAmrName';
import useAllMissionTitles from '@renderer/api/useMissionTitle';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, message, Select } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';

const CycleForm: FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formRegionSample] = Form.useForm();
  const { data: missionTitle } = useAllMissionTitles();
  const { t } = useTranslation();
  const { data: name } = useName();
  const AmrOption: { value: string; label: string }[] | undefined = name?.map((v) => ({
    value: v.amrId,
    label: v.amrId
  }));
  // Use an empty string instead of null
  AmrOption?.push({ value: '', label: t('mission.cycle_mission.random') });

  const misOptions = useMemo(() => {
    if (!missionTitle) return [];
    return missionTitle?.map((v) => {
      return {
        value: v.id,
        label: v.name
      };
    });
  }, [missionTitle]);

  const submitMutation = useMutation({
    mutationFn: (payload: { amrId: string; missionId: string }) => {
      return client.post('api/setting/add-cycle-mission', payload);
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const submit = () => {
    const data = formRegionSample.getFieldsValue() as {
      amrId: string;
      missionId: string;
    };

    if (!data.missionId) {
      messageApi.warning(t('mission.cycle_mission.mission_is_required'));
      return;
    }

    submitMutation.mutate(data);
  };

  return (
    <Form form={formRegionSample} autoComplete="off">
      {contextHolder}

      <Form.Item label={t('mission.cycle_mission.mission')} name="missionId" shouldUpdate>
        <Select showSearch options={misOptions} placeholder="Select a mission ok" />
      </Form.Item>

      <Form.Item label={t('mission.cycle_mission.car')} name="amrId" shouldUpdate>
        <Select showSearch placeholder="Select a mission ok" options={AmrOption} />
      </Form.Item>
      <Form.Item>
        <Button icon={<PlusOutlined />} onClick={() => submit()} color="primary" variant="filled">
          {t('utils.submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CycleForm;
