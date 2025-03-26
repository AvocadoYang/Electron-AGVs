import useName from '@renderer/api/useAmrName';
import useMap from '@renderer/api/useMap';
import useOneTaskDetail from '../../../../../../api/useOneTaskDetailFork';
import { Form, Input, InputNumber, Radio, Select, Skeleton } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

enum YawGenre {
  CUSTOM,
  SELECT,
  CALCULATE_BY_AGV_AND_SHELF_ANGLE
}

const TaskFormFork: FC<{
  editTaskKey: string;
  selectedMissionCar: string;
}> = ({ editTaskKey, selectedMissionCar }) => {
  const { data: taskDataSource, isLoading } = useOneTaskDetail(editTaskKey);

  // Map CarControl options for the operation select.
  const defaultOperation =
    taskDataSource?.missionTitle.Car.CarControl.map((v) => ({
      value: v.id,
      label: v.name
    })) || [];

  const [selectFork, setSelectFork] = useState('');
  const [isSelectWaitAmrList, setIsSelectWaitAmrList] = useState(false);
  const { t } = useTranslation();
  const { data: name } = useName();
  const AmrOption = name?.map((v) => ({ value: v.id, label: v.id }));

  const mapData = useMap();
  const loc = mapData.data?.locations
    .map((v) => ({
      label: v.locationId,
      value: v.locationId
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));

  const clearWaitAmrField = (needWait: boolean) => {
    if (needWait) {
      setIsSelectWaitAmrList(true);
      return;
    }
    setIsSelectWaitAmrList(false);
    form.setFieldValue('waitOtherAmr', null);
    form.setFieldValue('waitGenre', null);
  };

  useEffect(() => {
    if (!taskDataSource) return;

    // Set form fields based on taskDataSource values
    form.setFieldsValue({
      order: taskDataSource.order,
      genreId: taskDataSource.CarControl?.id,
      wait: taskDataSource.wait,
      is_define_id: taskDataSource.is_define_id,
      locationId: taskDataSource.locationId,
      is_define_yaw: taskDataSource.is_define_yaw,
      is_define_height: taskDataSource.is_define_height,
      f_height: taskDataSource.f_height,
      yaw: taskDataSource.yaw,
      hasCargoToProcess: taskDataSource.hasCargoToProcess,
      waitOtherAmr: taskDataSource.waitOtherAmr,
      waitGenre: taskDataSource.waitGenre,
      auto_preparatory_point: taskDataSource.auto_preparatory_point,
      hasWaitOther: !!taskDataSource.waitOtherAmr
    });

    if (taskDataSource.waitOtherAmr) {
      setIsSelectWaitAmrList(true);
    } else {
      setIsSelectWaitAmrList(false);
    }
  }, [form, taskDataSource]);

  if (!defaultOperation.length || isLoading) return <Skeleton active />;

  return (
    <Form form={form} labelCol={{ span: 6 }} autoComplete="off" size="small">
      <Form.Item label={t('mission.task_table.sort')} name="order">
        <Input disabled />
      </Form.Item>

      <Form.Item label={t('mission.task_table.is_custom_location')} name="is_define_id">
        <Select
          options={[
            { value: 'custom', label: t('mission.task_table.custom') },
            { value: 'select', label: t('mission.task_table.is_selectable') }
          ]}
        />
      </Form.Item>

      <Form.Item label={t('mission.task_table.action')} name="genreId">
        <Select options={defaultOperation} />
      </Form.Item>

      <Form.Item label={t('mission.task_table.location')} name="locationId">
        <Select showSearch allowClear style={{ width: '100%' }} options={loc} />
      </Form.Item>

      <Form.Item label={t('mission.task_table.wait')} name="wait">
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item label={t('mission.task_table.is_custom_yaw')} name="is_define_yaw">
        <Radio.Group buttonStyle="solid">
          <Radio.Button value={YawGenre.CUSTOM}>{t('mission.task_table.custom')}</Radio.Button>
          <Radio.Button value={YawGenre.SELECT}>
            {t('mission.task_table.is_selectable')}
          </Radio.Button>
          <Radio.Button value={YawGenre.CALCULATE_BY_AGV_AND_SHELF_ANGLE}>
            {t('mission.task_table.calculate_by_agv_and_shelf_angle')}
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('mission.task_table.yaw')} name="yaw">
        <InputNumber min={-180} max={180} />
      </Form.Item>

      <Form.Item label={t('mission.task_table.has_cargo_to_process')} name="hasCargoToProcess">
        <Radio.Group>
          <Radio value={false}>{t('utils.no')}</Radio>
          <Radio value={true}>{t('utils.yes')}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('mission.task_table.is_define_heigh')} name="is_define_height">
        <Radio.Group
          onChange={(e) => setSelectFork(e.target.value as string)}
          buttonStyle="solid"
          disabled={selectedMissionCar === 'ANWA-SW15'}
        >
          <Radio.Button value="custom">{t('mission.task_table.custom')}</Radio.Button>
          <Radio.Button value="select">{t('mission.task_table.is_selectable')}</Radio.Button>
          <Radio.Button value="auto" disabled>
            {t('mission.task_table.auto')}
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('mission.task_table.height')} name="f_height">
        <InputNumber
          min={0}
          max={7500}
          disabled={
            selectedMissionCar === 'ANWA-SW15' || selectFork === 'auto' || selectFork === 'select'
          }
        />
      </Form.Item>

      <Form.Item
        label={t('mission.task_table.auto_preparatory_point')}
        name="auto_preparatory_point"
      >
        <Radio.Group buttonStyle="solid">
          <Radio.Button value={false}>{t('utils.no')}</Radio.Button>
          <Radio.Button value>{t('utils.yes')}</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('mission.task_table.active_wait_amr')} name="hasWaitOther">
        <Radio.Group
          buttonStyle="solid"
          onChange={(v) => clearWaitAmrField(v.target.value as boolean)}
        >
          <Radio.Button value={false}>{t('utils.no')}</Radio.Button>
          <Radio.Button value>{t('utils.yes')}</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('mission.task_table.amr_list')} name="waitOtherAmr">
        <Select options={AmrOption} disabled={!isSelectWaitAmrList} />
      </Form.Item>

      <Form.Item label={t('mission.task_table.wait_genre')} name="waitGenre">
        <Select
          disabled={!isSelectWaitAmrList}
          options={[
            { value: 'second', label: t('mission.task_table.wait_other_finish') },
            { value: 'first', label: t('mission.task_table.execute_first') }
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default TaskFormFork;
