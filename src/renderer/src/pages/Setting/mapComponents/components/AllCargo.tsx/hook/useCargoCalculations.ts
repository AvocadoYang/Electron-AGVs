import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useLocation } from '~/api';
import useCargoMission from '~/api/useCargoMission';
import { LocWithoutArr } from '~/api/useLoc';
import { LayerType } from '~/api/useLocation';
import useShelf from '~/api/useShelf';
import { cargoStyle } from '~/configs/globalState';

interface CargoCalculationsProps {
  locId: string;
}

export const useCargoCalculations = ({ locId }: CargoCalculationsProps) => {
  const { data: cargoSource } = useCargoMission();
  const { data: loc } = useLocation(false);
  const { data: shelf } = useShelf();
  const [cStyle] = useAtom(cargoStyle);
  const uniqCargo = useMemo(
    () => cargoSource?.filter((k) => k.Loc.loc === locId),
    [cargoSource, locId],
  );

  const shelfStyle = useMemo(
    () =>
      shelf?.find((obj) => obj.Loc.loc === locId)?.ShelfCategory?.shelf_style,
    [shelf, locId],
  );

  const myLoc = useMemo(
    () => loc?.data.cargoArea.find((v) => v.id === locId),
    [loc, locId],
  );

  const targetStyle = useMemo(
    () => cStyle.find((item) => item.loc === locId) as LocWithoutArr,
    [cStyle, locId],
  );

  const transformStyles = useMemo(() => {
    if (!uniqCargo?.[0]) return null;

    return {
      translateX: targetStyle?.translateX ?? uniqCargo[0].Loc.translateX,
      translateY: targetStyle?.translateY ?? uniqCargo[0].Loc.translateY,
      scale: targetStyle?.scale ?? uniqCargo[0].Loc.scale,
      rotate: targetStyle?.rotate ?? uniqCargo[0].Loc.rotate,
    };
  }, [uniqCargo, targetStyle]);

  const layerInfo = useMemo(() => {
    if (!myLoc?.info.layer) return [];

    return myLoc.info.layer.map((cargo, index) => {
      const level = index;
      return {
        level,
        nameLevel: cargo[level]?.levelName || '',
        cargoValue: cargo[level]?.cargo?.hasCargo || false,
        borderColor: cargo[level]?.pallet?.color || '#c7c7c7',
        isOccupy: cargo[level]?.booked || false,
      };
    });
  }, [myLoc?.info.layer]);

  return {
    uniqCargo: uniqCargo?.[0],
    shelfStyle,
    layer: myLoc?.info.layer as LayerType[],
    targetStyle,
    transformStyles,
    layerInfo,
  };
};
