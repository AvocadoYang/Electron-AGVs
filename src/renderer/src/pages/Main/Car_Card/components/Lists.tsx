import { memo } from 'react';
import styled from 'styled-components';
import '../car_info.css';
import {
  EnvironmentOutlined,
  ThunderboltOutlined,
  CompassOutlined,
  CarOutlined,
  CaretUpOutlined,
  CaretDownOutlined
} from '@ant-design/icons';
import { Space, Tag, Flex } from 'antd';

// ======= DropArrow =================
const Arrow = styled.div<{ random_color: string }>`
  width: 1rem;
  height: 1rem;
  border: 2px solid gray;
  border: 2px solid ${({ random_color }) => random_color}; /* Use template literal for dynamic border color */
  border-radius: 50%;
  position: absolute;
  background-color: ${({ random_color }) =>
    random_color}; /* Use template literal for dynamic background color */

  /* top: 7%;
  right: -5%; */
  top: -0.3rem;
  right: -0.12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
export const DropDown: React.FC<{
  color: string;
  openFullInfoFn: () => void;
  openFullInfo: boolean;
}> = memo(({ color, openFullInfo, openFullInfoFn }) => {
  return (
    <Arrow
      random_color={color}
      onClick={(e) => {
        e.stopPropagation();
        openFullInfoFn();
      }}
    >
      {openFullInfo ? (
        <CaretUpOutlined style={{ color: 'white' }} />
      ) : (
        <CaretDownOutlined style={{ color: 'white' }} />
      )}
    </Arrow>
  );
});
// ======= Login status icon ==========
export const LogInStatus = styled.p.attrs<{ login: string }>((props) => {
  return { login: props.login };
})<{ login: string }>`
  background-color: ${(props) => (props.login === 'true' ? '	#2eb800' : 'red')};
  width: 0.6em;
  height: 0.6em;
  margin-left: 3%;
  border-radius: 50%;
`;

// ======= First row in info card =======
export const CarRow1 = styled.div.attrs<{ is_dark: string }>((props) => {
  return { is_dark: props.is_dark };
})<{ is_dark: string }>`
  width: 100%;
  display: flex;
  overflow: hidden;
  border-bottom: ${(props) => {
    return props.is_dark === 'true' ? '1px solid #c0c0c0' : '1px solid black';
  }};
  align-items: center;
  padding: 8px;
  color: ${(props) => {
    return props.is_dark === 'true' ? '#ffffff' : '#242222';
  }};
  justify-content: space-around;
`;
export const AmrTitle = styled.h2`
  font-size: 90%;
  line-height: 100%;
  text-align: center;
  /* font-weight: bold; */
  width: 80%;

  white-space: nowrap;
`;
export const RowOne: React.FC<{ isDark: boolean }> = memo(({ isDark }) => {
  return (
    <CarRow1 is_dark={isDark.toString()}>
      <div>
        <LogInStatus login={'true'}></LogInStatus>
        <span className={`login-text ${true ? '' : 'offline-text'}`}>{'離線'}</span>
      </div>

      <AmrTitle>
        <div style={{ marginBottom: '5px' }}>{'車號: 123'}</div>
        <span className={`${isDark ? 'amr-title-category-dark-mode' : 'amr-title-category'}`}>
          {'型號: anfa-ps14-16'}
        </span>
      </AmrTitle>
    </CarRow1>
  );
});

// ======Second row in info card ============
export const RowSecond: React.FC<{
  setOpenHiddenRow: React.Dispatch<boolean>;
  openHiddenRow: boolean;
  isDark: boolean;
}> = memo(({ setOpenHiddenRow, openHiddenRow, isDark }) => {
  return (
    <Flex
      className={`${isDark ? 'second-row-wrap' : ''}`}
      align="center"
      justify="space-around"
      style={{ margin: '1.5px 0 1px 0' }}
    >
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
        <EnvironmentOutlined
          className={`icon location-drawer location-icon ${isDark ? 'dark-icon location-icon-dark' : ''}`}
        />
        <p className={`value location-drawer ${isDark ? 'dark-icon' : ''}`}>
          {/* {((x: number | undefined, y: number | undefined) => {
                    if (x === undefined || y === undefined)
                      return undefined;
                    return `${x.toFixed(2)}/${y.toFixed(2)}`;
                  })(fleetInfo.originPose?.x, fleetInfo.originPose?.y)} */}
          {'9999'}
        </p>
      </Space>
      <Space direction="vertical" size={1} style={{ textAlign: 'center' }}>
        <CarOutlined className={`icon speed-icon ${isDark ? 'dark-icon' : ''}`} />
        <p className="value">
          {`999`}
          <span className={`${isDark ? 'symbol-dark' : 'symbol'}`}>{'km/h'}</span>
        </p>
      </Space>
      <Space direction="vertical" size={1} style={{ textAlign: 'center' }}>
        <ThunderboltOutlined
          className={`icon power-icon ${isDark ? 'dark-icon power-icon-dark' : ''}`}
        />
        <p className="value">
          {/* {fleetInfo.data.IO?.battery} */}
          {'90'}
          <span className={`${isDark ? 'symbol-dark' : 'symbol'}`}>{'%'}</span>
        </p>
      </Space>
      <Space direction="vertical" size={1} style={{ textAlign: 'center' }}>
        <CompassOutlined className={`icon yaw-icon ${isDark ? 'dark-icon yaw-icon-dark' : ''}`} />

        <p className="value">
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

//=======Hidden row ===================
const HiddenInfo = styled.div.attrs<{ open_hidden_row: string; is_dark: string }>((props) => {
  return { open_hidden_row: props.open_hidden_row, is_dark: props.is_dark };
})<{ open_hidden_row: string; is_dark: string }>`
  height: ${(props) => (props.open_hidden_row === 'true' ? '25px' : '0px')};
  color: ${(props) => (props.is_dark === 'true' ? 'white' : 'black')};
  overflow: hidden;
  text-align: center;
  font-size: 90%;
  transition: 0.5s;
`;
export const HiddenRow: React.FC<{ openHiddenRow: boolean; isDark: boolean }> = memo(
  ({ openHiddenRow, isDark }) => {
    return (
      <HiddenInfo open_hidden_row={openHiddenRow.toString()} is_dark={isDark.toString()}>
        <p style={{ marginTop: '5px' }}>{`X: 23.223 / Y: 99.999`}</p>
      </HiddenInfo>
    );
  }
);

// ======= Third row in info ===============
export const CarRow3 = styled.div.attrs<{ is_dark: string }>((props) => {
  return { is_dark: props.is_dark };
})<{ is_dark: string }>`
  width: 100%;
  display: flex;
  color: ${(props) => (props.is_dark === 'true' ? 'white' : 'black')};
  border-top: ${(props) => (props.is_dark === 'true' ? '1px dashed white' : '1px dashed gray')};
  justify-content: center;
  align-items: center;
  padding: 5px 5px 5px 8px;
  overflow: hidden;
`;
export const RowThread: React.FC<{ isDark: boolean }> = memo(({ isDark }) => {
  return (
    <CarRow3 is_dark={isDark.toString()}>
      <span className={`third-row-span ${isDark ? 'third-row-span-dark' : ''}`}>{'狀態: '}</span>
      <CarStatus>
        {false
          ? 'test test test test123 這是測試 這是測試 這是測試 這是測試 這是測試 這是測試'
          : '---------------'}
      </CarStatus>
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

// ======= Tag Wrap ==============
export const CarTag: React.FC<{ openFullInfo: boolean }> = memo(({ openFullInfo }) => {
  return (
    <Flex
      justify="center"
      align="center"
      className={` ${openFullInfo ? 'full-tag-wrap' : 'hide-tag-wrap'}`}
      wrap
      gap={'small'}
    >
      <Tag color="purple" style={{ margin: 0 }}>
        {'手動模式'}
      </Tag>
      <Tag color="#e3e4e3" style={{ margin: 0 }}>
        {'任務中'}
      </Tag>
      <Tag color="#e3e4e3" style={{ margin: 0 }}>
        {'攜帶貨物'}
      </Tag>

      <Tag color="#e3e4e3" style={{ margin: 0 }}>
        {'充電中'}
      </Tag>
      <Tag color="#e3e4e3" style={{ margin: 0 }}>
        {'低電量'}
      </Tag>
    </Flex>
  );
});
