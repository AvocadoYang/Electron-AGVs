import React from 'react'
import './car_info.css'
// import { useTranslation } from 'react-i18next'
import Card from './Card'

const CarCardWrap: React.FC = () => {
  // const { t } = useTranslation()
  return (
    <div className="card-wrap" draggable="false">
      {[1, 2, 3].map(() => (
        <Card key={2}></Card>
      ))}
    </div>
  )
}

export default CarCardWrap
