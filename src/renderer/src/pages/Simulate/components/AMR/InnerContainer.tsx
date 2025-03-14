import { FC } from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import { useAMR } from '~/socket';
import { Tooltip } from 'antd';

const Container = styled.div.attrs<{
  left: number;
  top: number;
  isAgv: boolean;
  rotate: number;
}>(({ left, top, isAgv, rotate }) => ({
  style: {
    transform: `${
      isAgv
        ? `translate(${left - 8}px, ${top - 9}px) rotate(${rotate}deg)`
        : `translate(${left - 8}px, ${top - 9}px) rotate(${rotate}deg)`
    }`,
    transition: 'x 1s, y 1s',
  },
}))<{
  isAgv: boolean;
  left: number;
  top: number;
  rotate: number;
}>`
  .detail {
    display: none;
  }
  position: absolute;
  opacity: 0.73;
  z-index: 20;
  border-radius: 10px;

  &:hover {
    .tooltip {
      display: flex;
    }
  }
`;

const InnerContainer: FC<{
  amrId: string;
  left: number;
  top: number;
}> = ({ amrId, left, top }) => {
  const { pose, color } = useAMR(amrId);

  if (!pose) return null;
  return (
    <Tooltip placement="top" title={amrId}>
      <Container
        key={amrId}
        left={left}
        top={top}
        isAgv={amrId.includes('SW15')}
        rotate={amrId.includes('SW15') ? 90 - pose.yaw + 180 : 90 - pose.yaw}
      >
        <Icon amrId={amrId} color={color} />
      </Container>
    </Tooltip>
  );
};

export default InnerContainer;
