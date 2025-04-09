/* eslint-disable no-void */

import { Flex, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { FC } from 'react';
import client from '@renderer/api/axiosClient';
import { useMutation } from '@tanstack/react-query';

const boxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 6
};

const BtnGroup: FC<{ amrId: string }> = ({ amrId }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const manualChargeMutation = useMutation({
    mutationFn: () => {
      return client.post('/api/amr/amr-charge', { amrId });
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
    },
    onError: () => {
      // eslint-disable-next-line no-void
      void messageApi.error(t('mission.charge_mission.haventSetChargeMission'));
    }
  });

  return (
    <>
      {contextHolder}
      <Flex style={boxStyle} justify="center" align="center" vertical gap="middle">
        <Button type="primary" onClick={() => manualChargeMutation.mutate()}>
          {t('charge.charge')}
        </Button>
      </Flex>
    </>
  );
};

export default BtnGroup;
