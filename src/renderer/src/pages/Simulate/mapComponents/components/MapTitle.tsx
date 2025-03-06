import useSimulateScript from '@renderer/api/useSimulateScript';
import { Typography } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const FloatTitle = styled.div`
  position: fixed;
  left: 2em;
  top: 6em;
`;

const MapTitle: FC = () => {
  const { t } = useTranslation();
  const { data } = useSimulateScript();

  return (
    <FloatTitle>
      <Typography.Text type="secondary">
        {t('sim.modal.current')}：{data?.name}
      </Typography.Text>
    </FloatTitle>
  );
};

export default MapTitle;
