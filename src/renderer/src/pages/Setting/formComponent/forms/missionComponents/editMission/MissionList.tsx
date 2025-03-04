 
import { Button, Flex, Form, message, Modal, Tooltip } from 'antd';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { nanoid } from 'nanoid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import client from '@renderer/api/axiosClient';
import { ActionTypes } from './mission';
import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { CopyOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';

const copy = (originKey: string) => {
  const randomId = nanoid();
  return {
    originKey,
    newKey: randomId
  };
};

const MissionList: FC<{
  selectedMissionKey: string
  setSelectedMissionKey: Dispatch<SetStateAction<string>>
  selectedMissionCar: string
}> = ({ selectedMissionKey, setSelectedMissionKey, selectedMissionCar }) => {
  const [open, setOpen] = useState(false);
  const [editTaskKey, setEditTaskKey] = useState('');
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const addTaskMutation = useMutation({
    mutationFn: () => {
      return client.post('api/setting/add-task', {
        key: selectedMissionKey
      });
    },
    onSuccess: async (resData) => {
      await queryClient.refetchQueries({
        queryKey: ['all-relate-task', resData.data.titleId]
      });
      messageApi.success(t('utils.success'));
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const copyMissionMutation = useMutation({
    mutationFn: () => {
      return client.post('api/setting/copy-task', copy(selectedMissionKey));
    },
    onSuccess: async (resData) => {
      await queryClient.refetchQueries({
        queryKey: ['all-relate-task', resData.data.titleId]
      });
      messageApi.success(t('utils.success'));
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const editTaskMutation = useMutation({
    mutationFn: (newData: ActionTypes) => {
      return client.post('api/setting/update-task', newData);
    },
    onSuccess: async (resData) => {
      await queryClient.refetchQueries({
        queryKey: ['all-relate-task', resData.data.titleId]
      });
      messageApi.success(t('utils.success'));
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });
  const addNewTask = () => {
    addTaskMutation.mutate();
  };

  const showModal = (key: string) => {
    setEditTaskKey(key);
    setOpen(true);
  };

  const handleOk = () => {
    const newData = form.getFieldsValue() as ActionTypes;

    if (
      newData.locationId === null ||
      newData.locationId === undefined ||
      newData.locationId === 0
    ) {
      messageApi.warning(t('mission.mission_list.location_required_warn'));
      return;
    }

    if (newData.wait === null) {
      messageApi.warning(t('mission.mission_list.wait_required_warn'));
      return;
    }

    if (newData.yaw === null) {
      messageApi.warning(t('mission.mission_list.yaw_required_warn'));
      return;
    }

    if (newData.f_height === null) {
      messageApi.warning(t('mission.mission_list.yaw_required_warn'));
      return;
    }

    if (
      newData.hasWaitOther === true &&
      (newData.waitGenre === null || newData.waitOtherAmr === null)
    ) {
      messageApi.warning(t('mission.mission_list.wait_amr_warn'));
      return;
    }

    const insureData: ActionTypes = {
      ...newData,
      id: editTaskKey,
      locationId: Number(newData.locationId)
    };

    editTaskMutation.mutate(insureData);
    setOpen(false);
  };

  const copyMission = () => {
    copyMissionMutation.mutate();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Flex gap="middle" justify="flex-start" align="start" vertical>
      {contextHolder}
      <Flex gap="middle">
        <Tooltip title={t('mission.mission_list.previous')}>
          <Button
            onClick={() => setSelectedMissionKey('')}
            color="default"
            variant="filled"
            icon={<LeftOutlined></LeftOutlined>}
          />
        </Tooltip>

        <Button
          icon={<PlusOutlined />}
          color="primary"
          variant="filled"
          style={{ marginBottom: 16 }}
          onClick={() => addNewTask()}
        >
          {t('mission.mission_list.create_mission')}
        </Button>

        <Button
          icon={<CopyOutlined />}
          color="primary"
          variant="filled"
          onClick={() => copyMission()}
          style={{ marginBottom: 16 }}
        >
          {t('mission.mission_list.copy_mission')}
        </Button>
      </Flex>

      <TaskTable showModal={showModal} selectedMissionKey={selectedMissionKey} />

      <Modal
        title={t('utils.edit')}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1350}
      >
        <TaskForm form={form} editTaskKey={editTaskKey} selectedMissionCar={selectedMissionCar} />
      </Modal>
    </Flex>
  );
};

export default MissionList;
