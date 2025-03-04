import client from '@renderer/api/axiosClient';
import useAllMissionTitles from '@renderer/api/useMissionTitle';
import { Err } from '@renderer/utils/responseErr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, message, Modal, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type ImportTask = {
  order: number
  currentTaskId: string
  importTaskId: string
}

const ImportMissionForm: FC<{
  showImportMission: boolean
  setShowImportMission: React.Dispatch<React.SetStateAction<boolean>>
  importConfig: {
    order: number
    key: string
  } | null
}> = ({ showImportMission, setShowImportMission, importConfig }) => {
  const [formImportMission] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { data } = useAllMissionTitles();
  const { t } = useTranslation();
  const importMutation = useMutation({
    mutationFn: (payload: ImportTask) => {
      return client.post('api/setting/import-task', payload);
    },
    onSuccess: async () => {
      void messageApi.success(t('utils.success'));
      await queryClient.refetchQueries({ queryKey: ['all-relate-task'] });
    },
    onError(error: Err) {
      messageApi.error(error.response.data.msg);
    }
  });

  const handleImportMissionOk = () => {
    if (!importConfig) {
      messageApi.warning(t('utils.error'));
      return;
    }

    setShowImportMission(false);

    const payload = formImportMission.getFieldsValue() as ImportTask;

    if (!payload.importTaskId || payload.importTaskId.trim() === '') {
      messageApi.warning(t('mission.add_mission.name_warn'));
      return;
    }

    const newPayload = {
      ...payload,
      currentTaskId: importConfig?.key,
      order: importConfig?.order
    };

    importMutation.mutate(newPayload);

    formImportMission.resetFields();
  };

  const handleImportMissionCancel = () => {
    formImportMission.resetFields();
    setShowImportMission(false);
  };

  const options = data?.map((v) => {
    return { value: v.id, label: v.name };
  });

  return (
    <>
      {contextHolder}

      <Modal
        title="引入任務"
        open={showImportMission}
        onOk={handleImportMissionOk}
        onCancel={handleImportMissionCancel}
      >
        <Form
          form={formImportMission}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          size="large"
        >
          <Form.Item
            hasFeedback
            rules={[{ required: true, message: t('mission.add_mission.name_warn') }]}
            label="任務"
            name="importTaskId"
          >
            <Select options={options} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ImportMissionForm;
