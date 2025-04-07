import { Button, message } from 'antd';
import { memo, useState } from 'react';
import styled from 'styled-components';
import '../webview.css';
import { useMutation } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import useMockRobot from '@renderer/api/useMockRobot';

const ScalePadWrap = styled.div`
  position: absolute;
  z-index: 4;
  top: 1%;
  left: 8%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 6px 13px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0);
  gap: 12px;
  opacity: 0.9;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 10px 15px;
    gap: 8px;
    border-radius: 16px;
  }

  @media (max-width: 576px) {
    padding: 9px 14px;
    gap: 7px;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    gap: 6px;
    border-radius: 12px;
  }
`;

const StyledButton = styled(Button)`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  padding: 0;
  border: none;
  background-color: #fcfafa74;
  color: #0e0e0e;
  font-weight: bold;
  font-size: 11px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.1s ease,
    transform 0.1s ease;

  &:hover {
    background-color: #40a9ff;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ScalePad = () => {
  const [scale, setScale] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();
  const { data: script } = useMockRobot();

  const sendSetScale = useMutation({
    mutationFn: (scale: number) => {
      return client.post(
        '/api/simulate/scale',
        { scale },
        {
          headers: { authorization: `Bearer ${localStorage.getItem('_KMT')}` }
        }
      );
    },
    onSuccess: (resData) => {
      const res = resData.data;
      if (res.status === 'success') {
        setScale(res.response.scale);
      } else {
        void messageApi.error('無法排除 聯絡FAE工程師');
      }
    },
    onError: () => {
      void messageApi.error('無法排除 聯絡FAE工程師');
    }
  });

  return (
    <>
      {contextHolder}
      {script?.isSimulate ? (
        <ScalePadWrap>
          <StyledButton
            className={`${scale === 1 ? 'select ' : ''}`}
            onClick={() => {
              if (scale === 1) return;
              sendSetScale.mutate(1);
            }}
          >
            x1
          </StyledButton>
          <StyledButton
            className={`${scale === 1.5 ? 'select ' : ''}`}
            onClick={() => {
              if (scale === 1.5) return;
              sendSetScale.mutate(1.5);
            }}
          >
            x1.5
          </StyledButton>
          <StyledButton
            className={`${scale === 2 ? 'select ' : ''}`}
            onClick={() => {
              if (scale === 2) return;
              sendSetScale.mutate(2);
            }}
          >
            x2
          </StyledButton>
          <StyledButton
            className={`${scale === 2.5 ? 'select' : ''}`}
            onClick={() => {
              if (scale === 2.5) return;
              sendSetScale.mutate(2.5);
            }}
          >
            x2.5
          </StyledButton>
        </ScalePadWrap>
      ) : null}
    </>
  );
};

export default memo(ScalePad);
