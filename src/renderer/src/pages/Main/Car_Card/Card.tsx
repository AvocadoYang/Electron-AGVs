import { InfoWrap } from './components/InfoWrap';
import { RowOne, RowThread, RowSecond, CarTag, HiddenRow, DropDown } from './components/Lists';
import './car_info.css';
import { useMemo, useState } from 'react';
import { ConfigProvider, Popover } from 'antd';
import BtnGroup from './components/BtnGroup';
import { useAtomValue, useSetAtom } from 'jotai';
import { AmrCarSelectFilter, AmrFilterCarCard, darkMode, hintAmr } from '@renderer/utils/gloable';
import { amrId2ColorRainbow } from '@renderer/utils/utils';

const Card: React.FC<{ id: string }> = ({ id }) => {
  const [openHiddenRow, setOpenHiddenRow] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [openFullInfo, setOpenFullInfo] = useState(true);
  // hover 卡片時地圖AMR的提示
  const setHintAmr = useSetAtom(hintAmr);
  // select選單篩選顯示的 AMR 系列
  const selectedOption = useAtomValue(AmrCarSelectFilter);
  //點擊地圖AMR時篩選卡片
  const hintAmrId = useAtomValue(AmrFilterCarCard);

  const isDark = useAtomValue(darkMode);

  const hide = useMemo(() => {
    if (hintAmrId.size) {
      return !hintAmrId.has(id);
    }
    if (!selectedOption) return false;
    if (selectedOption?.length) {
      const filter = new Set(selectedOption.map((item) => item.value));
      const AMRCategory = id.split('-').slice(0, 3).join('-');
      return filter.has(AMRCategory) ? false : true;
    }
    return false;
  }, [selectedOption, hintAmrId]);
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
          onOpenChange={(newOpen) => {
            setPopoverOpen(newOpen);
          }}
        >
          <InfoWrap
            className={`${hide ? 'hide-car-info-wrap' : ''}`}
            randomcolor={amrId2ColorRainbow(id)}
            is_dark={isDark.toString()}
            onMouseEnter={() => {
              setHintAmr(id);
            }}
            onMouseLeave={() => {
              setHintAmr('');
            }}
          >
            <DropDown
              color={amrId2ColorRainbow(id)}
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
