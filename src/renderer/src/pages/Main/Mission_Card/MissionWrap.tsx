import React from 'react'
import './mission_info.css'
import Card from './Card'
// import { useTranslation } from 'react-i18next'

const MissionWrap: React.FC = () => {
  // const { t } = useTranslation()
  return (
    <div className="mission-wrap">
      {[1, 2, 3].map(() => (
        <Card key={2}></Card>
      ))}
    </div>
  )
}

export default MissionWrap
