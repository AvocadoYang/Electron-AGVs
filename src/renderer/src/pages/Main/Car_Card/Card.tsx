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

  const handleOpenChange = (newOpen: boolean) => {
    setPopoverOpen(newOpen);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
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
              setOpenFullInfo={setOpenFullInfo}
            ></DropDown>
            <RowOne isDark={isDark} amrId={id}></RowOne>
            <RowSecond
              setOpenHiddenRow={setOpenHiddenRow}
              openHiddenRow={openHiddenRow}
              isDark={isDark}
              amrId={id}
            ></RowSecond>
            <HiddenRow openHiddenRow={openHiddenRow} isDark={isDark} amrId={id}></HiddenRow>
            <RowThread amrId={id} isDark={isDark}></RowThread>
            <CarTag openFullInfo={openFullInfo} amrId={id}></CarTag>
          </InfoWrap>
        </Popover>
      </ConfigProvider>
    </>
  );
};

export default Card;
