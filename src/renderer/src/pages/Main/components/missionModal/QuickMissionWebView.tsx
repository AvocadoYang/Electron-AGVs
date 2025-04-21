import { Select, Radio, Form, Input, Button, Space } from 'antd';
import './style.css';
import useName from '@renderer/api/useAmrName';
import { useMemo, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import { QuickMissionSelectParam } from '@renderer/utils/gloable';
import { QuickMissionPayload } from '../../global/jotai';

enum MissionPriority {
  TRIVIAL, // 沒差最後再做
  NORMAL, // 普通
  PIVOTAL, // 特別優先
  CRITICAL // 緊急
}

const QuickMissionWebView: React.FC<{
  setShowQuickMission: React.Dispatch<boolean>;
  showQuickMission: boolean;
}> = ({ setShowQuickMission, showQuickMission }) => {
  const [form] = Form.useForm();
  const { data: names } = useName();
  const setQuickMissionSelectParam = useSetAtom(QuickMissionSelectParam);
  const quickPayload = useAtomValue(QuickMissionPayload);
  const { t } = useTranslation();
  const [, setAmrGenre] = useState<string | null>(null);

  const AmrOption: { value: string; label: string }[] | undefined = useMemo(() => {
    let options;
    if (names?.isSim) {
      options = names.amrs
        .filter((a) => a.isReal === false)
        .map((m) => ({ label: m.amrId, value: m.amrId }));
    } else {
      options = names?.amrs
        .filter((a) => a.isReal === true)
        .map((m) => ({ label: m.amrId, value: m.amrId }));
    }
    return options ? [...options, { value: 'null', label: t('utils.random') }] : undefined;
  }, [names, t]);

  return (
    <div
      className={`quick-mission-web-wrap ${showQuickMission ? 'quick-mission-web-wrap-show' : ''}`}
    >
      <div className="form-info-wrap">
        <CloseOutlined className="form-info-icon" onClick={() => setShowQuickMission(false)} />
        <p className="form-title">{t('main.card_name.quick_mission')}</p>
      </div>
      <Form form={form}>
        <Form.Item label={`${t('mission.cycle_mission.car')} `} name="amrId">
          <Select
            options={AmrOption}
            onChange={(v: string) => setAmrGenre(v)}
            placeholder={'Select an AMR'}
          />
        </Form.Item>
        <Form.Item
          label={`${t('main.mission_modal.dialog_mission.task_priority')} `}
          name="priority"
          shouldUpdate
        >
          <Radio.Group>
            <Radio.Button value={MissionPriority.CRITICAL}>
              {t('main.mission_modal.dialog_mission.priority.CRITICAL')}
            </Radio.Button>
            <Radio.Button value={MissionPriority.PIVOTAL}>
              {t('main.mission_modal.dialog_mission.priority.PIVOTAL')}
            </Radio.Button>
            <Radio.Button value={MissionPriority.NORMAL}>
              {t('main.mission_modal.dialog_mission.priority.NORMAL')}
            </Radio.Button>
            <Radio.Button value={MissionPriority.TRIVIAL}>
              {t('main.mission_modal.dialog_mission.priority.TRIVIAL')}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Space>
          <Form.Item label={t('car_control_translate.load')} name={'load'}>
            <Input
              placeholder={t('car_control_translate.load')}
              onMouseDown={() => {
                setQuickMissionSelectParam('load');
              }}
            />
          </Form.Item>
          <Button>load</Button>
        </Space>

        <Space>
          <Form.Item label={t('car_control_translate.offload')} name={'offload'}>
            <Input
              placeholder={t('car_control_translate.offload')}
              onMouseDown={() => {
                setQuickMissionSelectParam('offload');
              }}
            />
          </Form.Item>
          <Button>offload</Button>
        </Space>
      </Form>
    </div>
  );
};

export default QuickMissionWebView;
