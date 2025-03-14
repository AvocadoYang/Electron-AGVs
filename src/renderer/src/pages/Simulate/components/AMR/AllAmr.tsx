import { FC, memo } from 'react';
import styled from 'styled-components';
import AmrIcon from './AmrIcon';
import useName from '@renderer/api/useAmrName';
import { amrId2Color } from '@renderer/utils/utils';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AMRPadWrap = styled.div`
  position: absolute;
  z-index: 4;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  background-color: #f5f5f5;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  transition: opacity 0.3s ease-in-out;
  width: 3em;
  height: 40vh;
  padding: 1em 0em;
  justify-content: space-between;

  &:hover {
    opacity: 1;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  height: 80%;
  overflow-y: scroll;
  align-items: center;
  gap: 1em;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
`;

const AmrIconStyled = styled(AmrIcon)`
  width: 2em;
  min-width: 150px;
  height: 2em;
  margin-bottom: 1.5em; /* Add margin to create spacing */

  &:last-child {
    margin-bottom: 0; /* Remove margin from the last item */
  }
`;

const AllAmr: FC = () => {
  const { data: car } = useName();

  if (!car || car.length === 0) return null;
  return (
    <>
      <AMRPadWrap>
        <Box>
          {car.map((v) => {
            return <AmrIconStyled key={v.id} amrId={v.id} color={amrId2Color(v.id)} />;
          })}
        </Box>

        <Button shape="circle" icon={<PlusOutlined />}></Button>
      </AMRPadWrap>
    </>
  );
};

export default memo(AllAmr);
