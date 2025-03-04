import useAllChargeStation from '@renderer/api/useAllCharge';
import useMap from '@renderer/api/useMap';
import { chargeStationEditData, isEditChargeStation } from '@renderer/utils/gloable';
import { rosCoord2DisplayCoord } from '@renderer/utils/utils';
import { useAtomValue } from 'jotai';
import styled from 'styled-components';

const Svg = styled.svg`
  width: 20px;
  color: white;
`;

type Station = {
  scale: number
  translate_x: number
  translate_y: number
  rotate: number
}

type CType = {
  left: number
  top: number
}

const Container = styled.div<CType>`
  position: absolute;
  top: ${(prop) => `${prop.top}px`};
  left: ${(prop) => `${prop.left}px`};
  width: 3px;
  background: #3bbdc1;
  height: 3px;
  border-radius: 50%;
`;

const CStation = styled.div<Station>`
  width: 21px;
  height: 26px;
  background: '#ff2b2b';
  border: 1px solid black;
  z-index: 20;
  text-align: center;
  display: flex;
  border-radius: 5px;
  font-weight: bolder;
  justify-content: center;
  align-content: center;
  align-items: center;
  transform: ${(props) =>
    `translate(${props.translate_x}em, ${props.translate_y}em) scale(${props.scale}) rotate(${props.rotate}deg)`};
`;

const SudoChargeStation = () => {
  const selectStation = useAtomValue(chargeStationEditData);
  const { data: defaultData } = useAllChargeStation();
  const isEditChargeStationNow = useAtomValue(isEditChargeStation);
  const defaultStyle = defaultData?.find((v) => v?.locationId === Number(selectStation?.loc));
  const mapData = useMap();

  if (!mapData.data || !isEditChargeStationNow) {
    return null;
  }

  const [left, top] = rosCoord2DisplayCoord({
    x: defaultStyle?.x as number,
    y: defaultStyle?.y as number,
    mapHeight: mapData.data.mapHeight,
    mapOriginX: mapData.data.mapOriginX,
    mapOriginY: mapData.data.mapOriginY,
    mapResolution: mapData.data.mapResolution
  });

  if (defaultStyle === undefined || defaultStyle === null) return <>something not working</>;
  if (!selectStation) return [];
  return (
    <Container left={left} top={top} key={selectStation.loc}>
      <CStation
        scale={selectStation.scale}
        rotate={selectStation.rotate}
        translate_x={selectStation.translateX}
        translate_y={selectStation.translateY}
      >
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z" />
        </Svg>
      </CStation>
    </Container>
  );
};

export default SudoChargeStation;
