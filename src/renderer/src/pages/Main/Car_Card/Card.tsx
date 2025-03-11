import { InfoWrap } from './components/InfoWrap';
import { RowOne, RowThread, RowSecond, CarTag, HiddenRow } from './components/Lists';
import './car_info.css';
import { useState } from 'react';
import { ConfigProvider, Popover } from 'antd';
import BtnGroup from './components/BtnGroup';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';

const Card: React.FC<{ id: number }> = ({ id }) => {
  const [openHiddenRow, setOpenHiddenRow] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const isDark = useAtomValue(darkMode);

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
          <InfoWrap randomcolor={'red'} is_dark={isDark.toString()}>
            <RowOne isDark={isDark}></RowOne>
            <RowSecond
              setOpenHiddenRow={setOpenHiddenRow}
              openHiddenRow={openHiddenRow}
              isDark={isDark}
            ></RowSecond>
            <HiddenRow openHiddenRow={openHiddenRow} isDark={isDark}></HiddenRow>
            <RowThread isDark={isDark}></RowThread>
            <CarTag></CarTag>
          </InfoWrap>
        </Popover>
      </ConfigProvider>
    </>
  );
};

export default Card;
