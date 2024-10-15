import React from 'react'
import './car_info.css'
import { useTranslation } from 'react-i18next'

const CarCardWrap: React.FC = () => {
  const { t } = useTranslation()
  return <div className="card-wrap">{t('test_translation')}</div>
}

export default CarCardWrap
