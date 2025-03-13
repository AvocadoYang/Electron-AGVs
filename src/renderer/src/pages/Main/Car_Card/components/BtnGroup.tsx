/* eslint-disable no-void */

import { Flex, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { FC } from 'react';

const boxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 6
};

const BtnGroup: FC<{}> = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      <Flex style={boxStyle} justify="center" align="center" vertical gap="middle">
        <Button onClick={() => {}} type="primary">
          {t('charge.charge')}
        </Button>

        <Button type="primary" onClick={() => {}}>
          123
        </Button>
      </Flex>
    </>
  );
};

export default BtnGroup;
