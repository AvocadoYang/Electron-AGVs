import { InfoWrap } from './components/InfoWrap';
import { RowOne, RowThread, RowSecond, CarTag, HiddenRow, DropDown } from './components/Lists';
import './car_info.css';
import { useState } from 'react';
import { ConfigProvider, Popover } from 'antd';
import BtnGroup from './components/BtnGroup';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';
import { amrId2Color } from '@renderer/utils/utils';

const Card: React.FC<{ id: string }> = ({ id }) => {
  const [openHiddenRow, setOpenHiddenRow] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [openFullInfo, setOpenFullInfo] = useState(false);
  const isDark = useAtomValue(darkMode);

  const openFullInfoFn = () => {
    setOpenFullInfo((pre) => !pre);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setPopoverOpen(newOpen);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            colorBgElevated: 'rgba(255, 254, 254, 0.65)'
          },
          components: {
            Popover: {
              titleMinWidth: 110
            }
          }
        }}
      >
        <Popover
          content={<BtnGroup />}
          trigger="click"
          open={isPopoverOpen}
          placement="rightTop"
          onOpenChange={handleOpenChange}
        >
          <InfoWrap randomcolor={amrId2Color(id)} is_dark={isDark.toString()}>
            <DropDown
              color={amrId2Color(id)}
              openFullInfo={openFullInfo}
              openFullInfoFn={openFullInfoFn}
            ></DropDown>
            <RowOne isDark={isDark}></RowOne>
            <RowSecond
              setOpenHiddenRow={setOpenHiddenRow}
              openHiddenRow={openHiddenRow}
              isDark={isDark}
            ></RowSecond>
            <HiddenRow openHiddenRow={openHiddenRow} isDark={isDark}></HiddenRow>
            <RowThread isDark={isDark}></RowThread>
            <CarTag openFullInfo={openFullInfo}></CarTag>
          </InfoWrap>
        </Popover>
      </ConfigProvider>
    </>
  );
};

export default Card;
