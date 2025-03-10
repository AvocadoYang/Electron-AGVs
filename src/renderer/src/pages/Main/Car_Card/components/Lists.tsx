import { memo } from 'react';
import styled from 'styled-components';

import {
  EnvironmentOutlined,
  ThunderboltOutlined,
  CompassOutlined,
  CarOutlined
} from '@ant-design/icons';
import { Space, Tag, Flex } from 'antd';

export const AmrTitle = styled.h2`
  font-size: 90%;
  line-height: 100%;
  text-align: center;
  /* font-weight: bold; */
  width: 100%;

  white-space: nowrap;
`;

// ======= Login status icon ==========
export const LogInStatus = styled.p.attrs<{ login: string }>((props) => {
  return { login: props.login };
})<{ login: string }>`
  background-color: ${(props) => (props.login === 'true' ? '	#2eb800' : 'red')};
  color: ${(props) => (props.login === 'false' ? 'black' : 'white')};
  width: 0.6em;
  height: 0.6em;
  margin-left: 3%;
  border-radius: 50%;
`;
// ================================

// ======= First row in info card =======
export const CarRow1 = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden;
  border-bottom: 1px solid gray;
  align-items: center;
  padding: 8px;
  justify-content: space-around;
`;
export const RowOne = memo(() => {
  return (
    <CarRow1>
      <LogInStatus login={'true'}></LogInStatus>

      <AmrTitle>
        <div style={{ marginBottom: '5px' }}>{'車號: 123'}</div>
        <span style={{ fontSize: '10px', color: '#646963' }}>{'型號: anfa-ps14-16'}</span>
      </AmrTitle>
    </CarRow1>
  );
});
// ==============================

// ======Second row in info card ============
export const RowSecond: React.FC<{
  setOpenHiddenRow: React.Dispatch<boolean>;
  openHiddenRow: boolean;
}> = memo(({ setOpenHiddenRow, openHiddenRow }) => {
  return (
    <Flex align="center" justify="space-around" style={{ margin: '1.5px 0 1px 0' }}>
      <Space
        direction="vertical"
        size={1}
        style={{ textAlign: 'center' }}
        onClick={(e) => {
          e.stopPropagation();
          setOpenHiddenRow(!openHiddenRow);
        }}
        className="location-drawer"
      >
        <EnvironmentOutlined style={{ fontSize: '0.7em' }} className="location-drawer" />
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.85em'
          }}
          className="value location-drawer"
        >
          {/* {((x: number | undefined, y: number | undefined) => {
                    if (x === undefined || y === undefined)
                      return undefined;
                    return `${x.toFixed(2)}/${y.toFixed(2)}`;
                  })(fleetInfo.originPose?.x, fleetInfo.originPose?.y)} */}
          {'9999'}
        </p>
      </Space>
      <Space direction="vertical" size={1} style={{ textAlign: 'center' }}>
        <CarOutlined style={{ fontSize: '0.7em' }} />

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.85em'
          }}
          className="value"
        >
          {`999`}
          <span style={{ color: 'gray', fontSize: '0.85em' }}>{' km/h'}</span>
        </p>
      </Space>
      <Space direction="vertical" size={1} style={{ textAlign: 'center' }}>
        <ThunderboltOutlined style={{ fontSize: '0.7em' }} />
        <p style={{ textAlign: 'center', fontSize: '0.85em' }} className="value">
          {/* {fleetInfo.data.IO?.battery} */}
          {'90%'}
        </p>
      </Space>
      <Space direction="vertical" size={1} style={{ textAlign: 'center' }}>
        <CompassOutlined style={{ fontSize: '0.7em' }} />

        <p style={{ textAlign: 'center', fontSize: '0.85em' }} className="value">
          {/* {((yaw: number | undefined) => {
                        if (yaw === undefined) return undefined;
                        return parseFloat(yaw.toFixed(2));
                      })(fleetInfo.originPose?.yaw)} */}
          {'123'}
        </p>
      </Space>
    </Flex>
  );
});
//==========================

//=======Hidden row ===================
const HiddenInfo = styled.div.attrs<{ open_hidden_row: string }>((props) => {
  return { open_hidden_row: props.open_hidden_row };
})<{ open_hidden_row: string }>`
  height: ${(props) => (props.open_hidden_row === 'true' ? '25px' : '0px')};
  overflow: hidden;
  /* border-top: 1px dashed black; */
  text-align: center;
  font-size: 90%;
  transition: 0.5s;
`;
export const HiddenRow: React.FC<{ openHiddenRow }> = memo(({ openHiddenRow }) => {
  return (
    <HiddenInfo open_hidden_row={openHiddenRow.toString()}>
      <p style={{ marginTop: '5px' }}>{`x: 23.223 / y: 99.999`}</p>
    </HiddenInfo>
  );
});
//=================================

// ======= Third row in info ===============
export const CarRow3 = styled.div`
  width: 100%;
  display: flex;
  border-top: 1px dashed gray;
  justify-content: center;
  align-items: center;
  padding: 5px 5px 5px 8px;
  border-bottom: 1px dashed gray;
  overflow: hidden;
`;
export const RowThread = memo(() => {
  return (
    <CarRow3>
      <span
        style={{
          color: '#808080',
          textAlign: 'center',
          width: '20%',
          fontSize: '65%'
        }}
      >
        {'狀態: '}
      </span>
      <CarStatus>{false ? 'test test test test123' : '---------------'}</CarStatus>
    </CarRow3>
  );
});
export const CarStatus = styled.span`
  font-weight: bold;
  font-size: 75%;
  text-align: center;
  word-wrap: break-word;
  width: 80%;
  color: red;
  margin-right: 3px;
`;
// ==============================

export const CarTag = memo(() => {
  return (
    <Flex align="center" style={{ padding: '3px' }} wrap gap={'small'}>
      <Tag color="purple">{'手動模式'}</Tag>
      <Tag color="#e3e4e3">{'任務中'}</Tag>
      <Tag color="#e3e4e3">{'攜帶貨物'}</Tag>
      <Tag color="#e3e4e3">{'充電中'}</Tag>
      <Tag color="#e3e4e3">{'低電量'}</Tag>
    </Flex>
  );
});
