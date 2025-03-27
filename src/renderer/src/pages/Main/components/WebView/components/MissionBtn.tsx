import { ThunderboltOutlined, RedoOutlined, CalendarOutlined } from '@ant-design/icons';
import '../webview.css';
import { Button, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { DialogMission } from '../../missionModal';
import { memo, useState } from 'react';
import { OpenAssignMission } from '@renderer/pages/Main/global/jotai';
import { useSetAtom } from 'jotai';
import QuickMissionWebView from '../../missionModal/QuickMissionWebView';

const MissionBtn = () => {
  const { t } = useTranslation();
  const openAssignMission = useSetAtom(OpenAssignMission);
  const [showQuickMission, setShowQuickMission] = useState(false);
  return (
    <>
      <Flex gap="small" wrap="wrap" align="center" justify="end" className="mission-btn-wrap">
        {/* <Button type="primary" size="small" onClick={() => {}} icon={<SignatureOutlined />}>
        {t('main.card_name.input_mission')}
      </Button> */}

        <Button color="primary" variant="outlined" onClick={() => {}} icon={<RedoOutlined />}>
          {t('toolbar.mission.cycle_mission')}
        </Button>

        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            setShowQuickMission(!showQuickMission);
          }}
          icon={<ThunderboltOutlined />}
        >
          {t('main.card_name.quick_mission')}
        </Button>

        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            openAssignMission(true);
          }}
          icon={<CalendarOutlined />}
        >
          {t('main.card_name.new_mission')}
        </Button>
      </Flex>
      <DialogMission></DialogMission>
      <QuickMissionWebView
        showQuickMission={showQuickMission}
        setShowQuickMission={setShowQuickMission}
      ></QuickMissionWebView>
    </>
  );
};

export default memo(MissionBtn);
