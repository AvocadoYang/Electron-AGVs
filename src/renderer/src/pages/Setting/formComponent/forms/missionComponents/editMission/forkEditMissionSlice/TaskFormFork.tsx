import { Button, Flex, Form, Input, InputNumber, message, Segmented, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Action_Type,
  Control_Types,
  Select_Active_Robot_Type,
  Select_Fork_Height_Type,
  Select_Location_Type
} from './types';
import { controlList } from './params';
import SubmitButton from '@renderer/utils/SubmitButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { Err } from '@renderer/utils/responseErr';
import useOneTaskDetailFork from '@renderer/api/useOneTaskDetailFork';
import useTaskOptions from './hook/useTaskOptions';

enum YawGenre {
  CUSTOM,
  SELECT,
  CALCULATE_BY_AGV_AND_SHELF_ANGLE
}

const TaskFormFork: FC<{
  editTaskKey: string;
  selectedMissionCar: string;
}> = ({ editTaskKey, selectedMissionCar }) => {
  const {
    robotOption,
    locationsOption,
    NormalActionListOptions,
    SpecialActionListOptions,
    SelectLocationOptions,
    SelectYawOptions,
    SelectForkHeightOptions,
    SelectActiveWaitRobotOptions,
    SelectWaitRobotOptions
  } = useTaskOptions();
  const { data: originFormData } = useOneTaskDetailFork(editTaskKey);
  const [actionState, setActionStatus] = useState<Action_Type>();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSpecialAction, setIsSpecialAction] = useState(false);
  const [controlClickOrder, setControlClickOrder] = useState<string[]>([]);
  const [selectLocationType, setSelectLocationType] = useState<Select_Location_Type>();
  const [selectYaw, setSelectYaw] = useState<YawGenre>();
  const [selectForkHeight, setSelectForkHeight] = useState<Select_Fork_Height_Type>();
  const [otherSpecial, setOtherSpecial] = useState(false);
  const [selectActiveWaitRobot, setSelectActiveWaitRobot] = useState<Select_Active_Robot_Type>();

  const { t } = useTranslation();
  const [form] = Form.useForm();

  const isIncludeSpin = controlClickOrder.map((v) => v.split('-')[0]).includes('S');
  const isIncludeH = controlClickOrder.map((v) => v.split('-')[0]).includes('H');

  const handleControlClick = (controlValue: string) => {
    setControlClickOrder((prevOrder) => {
      if (prevOrder.includes(controlValue)) {
        const newOrder = prevOrder.filter((item) => item !== controlValue);
        return newOrder;
      } else {
        const newOrder = [...prevOrder, controlValue];
        return newOrder;
      }
    });

    setTimeout(() => {
      form.setFieldsValue({ control: controlClickOrder });
    }, 0);
  };

  const editMutation = useMutation({
    mutationFn: (payload) => {
      return client.post('api/setting/update-task-fork', payload);
    },
    onSuccess: async () => {
      messageApi.success(t('utils.success'));
    },
    onError(error: Err) {
      messageApi.error(error.response.data.message);
    }
  });

  const onFinish = () => {
    const payload = form.getFieldsValue();

    if (actionState === 'spin' && !isIncludeSpin) {
      messageApi.warning(t('mission.task_table.spin_warn'));
      return;
    }

    const newPayload = {
      ...payload,
      action_type: actionState,
      control: controlClickOrder,
      id: editTaskKey
    };
    // console.log(newPayload);
    editMutation.mutate(newPayload);
  };

  useEffect(() => {
    if (originFormData) {
      setActionStatus(originFormData.operation.type as Action_Type);
      setControlClickOrder(
        originFormData.operation.control?.map((v: string, i: number) => `${v}-${i}`) || []
      );
      setSelectLocationType(
        (originFormData.operation.is_define_id as Select_Location_Type) || 'custom'
      );
      setSelectYaw(
        originFormData.operation.is_define_yaw !== undefined
          ? (originFormData.operation.is_define_yaw as YawGenre)
          : undefined
      );
      setSelectForkHeight(originFormData.io?.fork?.is_define_height as Select_Fork_Height_Type);
      setOtherSpecial(originFormData.operation.waitGenre !== null);
      setSelectActiveWaitRobot(originFormData.operation.waitGenre !== null ? 'enable' : 'disable');

      form.setFieldsValue({
        action_type: originFormData.operation.type,
        control: originFormData.operation.control?.map((v: string, i: number) => `${v}-${i}`),
        wait: originFormData.operation.wait,
        is_define_id: originFormData.operation.is_define_id,
        locationId: originFormData.operation.locationId?.toString(),
        is_define_yaw: originFormData.operation.is_define_yaw,
        yaw: originFormData.operation.yaw,
        fork_height_select: originFormData.io?.fork?.is_define_height,
        height: originFormData.io?.fork?.height,
        active_wait_amr: originFormData.operation.hasCargoToProcess ? 'enable' : 'disable',
        waitOtherAmr: originFormData.operation.waitOtherAmr,
        wait_genre: originFormData.operation.waitGenre
      });
    }
  }, [originFormData, form]);

  useEffect(() => {
    if (!otherSpecial) {
      form.setFieldsValue({
        waitOtherAmr: null,
        wait_genre: null
      });
    }
  }, [otherSpecial]);

  return (
    <>
      {contextHolder}
      <Form form={form} autoComplete="off" size="small" variant="underlined">
        <Flex gap="large" justify="space-between">
          <Form.Item label={t('mission.task_table_human_robot.action')} name="action_type">
            <Segmented
              onChange={(e: Action_Type) => setActionStatus(e)}
              options={isSpecialAction ? SpecialActionListOptions : NormalActionListOptions}
            />
          </Form.Item>
          <Tooltip
            title={
              isSpecialAction ? t('mission.task_table.normal') : t('mission.task_table.special')
            }
          >
            <Button
              type={isSpecialAction ? 'primary' : 'default'}
              onClick={() => setIsSpecialAction(!isSpecialAction)}
            >
              {isSpecialAction ? 'N' : 'S'}
            </Button>
          </Tooltip>
        </Flex>

        <Flex align="center" justify="space-between">
          {actionState !== undefined ? (
            <Form.Item label={t('mission.task_table.action')} name="control">
              <Flex gap="small">
                {controlList[actionState].map((v, i) => {
                  const uniqueValue = `${v}-${i}`;

                  const movement = v as Control_Types;
                  let text = '';

                  switch (movement) {
                    case 'F':
                      text = t('car_control_translate.F');
                      break;
                    case 'H':
                      text = t('car_control_translate.H');
                      break;
                    case 'S':
                      text = t('car_control_translate.S');
                      break;
                    case 'B':
                      text = t('car_control_translate.B');
                      break;
                    case 'W':
                      text = t('car_control_translate.W');
                      break;
                    default:
                      text = 'unknown movement';
                  }

                  return (
                    <Tooltip key={uniqueValue} title={text} mouseEnterDelay={0.5}>
                      <Button
                        type={controlClickOrder.includes(uniqueValue) ? 'primary' : 'default'}
                        onClick={() => handleControlClick(uniqueValue)}
                      >
                        {v}
                      </Button>
                    </Tooltip>
                  );
                })}
              </Flex>
            </Form.Item>
          ) : (
            []
          )}
          <Flex>
            <Input
              disabled
              style={{ width: 200, marginBottom: 24 }}
              value={controlClickOrder.flatMap((v) => v.split('-')[0]).join(', ')}
            />
            <Tooltip title={t('utils.reset')}>
              <Button
                style={{ marginBottom: 24 }}
                icon={<RedoOutlined />}
                onClick={() => setControlClickOrder([])}
              />
            </Tooltip>
          </Flex>
        </Flex>

        {controlClickOrder.some((item) => item.startsWith('W')) && (
          <Form.Item label={t('mission.task_table.wait')} name="wait">
            <InputNumber min={1} placeholder="1" />
          </Form.Item>
        )}

        {actionState !== 'spin' ? (
          <Form.Item label={t('mission.task_table.is_custom_location')} name="is_define_id">
            <Segmented
              onChange={(e: Select_Location_Type) => setSelectLocationType(e)}
              options={SelectLocationOptions}
            />
          </Form.Item>
        ) : (
          []
        )}

        {selectLocationType === 'custom' && actionState !== 'spin' ? (
          <Form.Item label={t('mission.task_table.location')} name="locationId">
            <Select style={{ width: 210 }} options={locationsOption} />
          </Form.Item>
        ) : (
          []
        )}

        {actionState === 'spin' || isIncludeSpin ? (
          <Form.Item label={t('mission.task_table.is_custom_yaw')} name="is_define_yaw">
            <Segmented onChange={(e: YawGenre) => setSelectYaw(e)} options={SelectYawOptions} />
          </Form.Item>
        ) : (
          []
        )}

        {selectYaw === YawGenre.CUSTOM && isIncludeSpin ? (
          <Form.Item label={t('mission.task_table.yaw')} name="yaw">
            <InputNumber min={1} placeholder="1" />
          </Form.Item>
        ) : (
          []
        )}

        {actionState === 'load' || actionState === 'offload' || isIncludeH ? (
          <Form.Item label={t('mission.task_table.is_define_heigh')} name="fork_height_select">
            <Segmented
              onChange={(e: Select_Fork_Height_Type) => setSelectForkHeight(e)}
              options={SelectForkHeightOptions}
            />
          </Form.Item>
        ) : (
          []
        )}

        {selectForkHeight === 'custom' && isIncludeH ? (
          <Form.Item label={t('mission.task_table.height')} name="height">
            <InputNumber min={1} placeholder="1" />
          </Form.Item>
        ) : (
          []
        )}

        <Flex gap="middle" style={{ marginBottom: 24 }}>
          <Button
            onClick={() => setOtherSpecial(!otherSpecial)}
            type={otherSpecial ? 'primary' : 'default'}
          >
            {t('mission.task_table.other_special')}
          </Button>
          <Tooltip title={t('mission.task_table.special_movement_info')}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>

        {otherSpecial ? (
          <Form.Item label={t('mission.task_table.active_wait_amr')} name="active_wait_amr">
            <Segmented
              onChange={(e: Select_Active_Robot_Type) => setSelectActiveWaitRobot(e)}
              options={SelectActiveWaitRobotOptions}
            />
          </Form.Item>
        ) : (
          []
        )}

        {otherSpecial && selectActiveWaitRobot === 'enable' ? (
          <Form.Item label={t('mission.task_table.wait_genre')} name="waitOtherAmr">
            <Select options={robotOption} />
          </Form.Item>
        ) : (
          []
        )}

        {otherSpecial && selectActiveWaitRobot === 'enable' ? (
          <Form.Item label={t('mission.task_table.wait_genre')} name="wait_genre">
            <Segmented options={SelectWaitRobotOptions} />
          </Form.Item>
        ) : (
          []
        )}

        <Flex align="center" justify="center">
          <SubmitButton onOk={onFinish} isModel={false} form={form} text="save" />
        </Flex>
      </Form>
    </>
  );
};

export default TaskFormFork;
