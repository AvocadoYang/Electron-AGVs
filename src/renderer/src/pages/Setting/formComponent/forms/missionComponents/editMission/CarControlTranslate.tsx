import { useTranslation } from 'react-i18next';

const CarControlTranslate = ({ word }: { word: string | undefined }) => {
  const { t } = useTranslation();

  switch (word) {
    case '移動':
      return <>{t('car_control_translate.move')}</>;
    case '取貨':
      return <>{t('car_control_translate.load')}</>;
    case '放貨':
      return <>{t('car_control_translate.offload')}</>;
    case '充電':
      return <>{t('car_control_translate.charge')}</>;
    case '貨高限制':
      return <>{t('car_control_translate.cargo_limit')}</>;
    default:
      return <>{word}</>;
  }
};

export default CarControlTranslate;
