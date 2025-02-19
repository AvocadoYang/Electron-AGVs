import { MTType } from '@renderer/api/useMissionTitle'
import React, { FC } from 'react'
import MissionTable from './MissionTable'
import MissionList from './MissionList'

interface SwitchTableProps {
  selectedMissionKey: string
  setEditMissionKey: React.Dispatch<React.SetStateAction<string>>
  setOpenMissionModel: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedMissionKey: React.Dispatch<React.SetStateAction<string>>
  setSelectedMissionCar: React.Dispatch<React.SetStateAction<string>>
  selectedMissionCar: string
  filterMissionData: MTType
  children: React.ReactNode
}

const SwitchTable: FC<SwitchTableProps> = ({
  selectedMissionKey,
  setEditMissionKey,
  setOpenMissionModel,
  setSelectedMissionKey,
  setSelectedMissionCar,
  selectedMissionCar,
  filterMissionData,
  children
}) =>
  selectedMissionKey === '' ? (
    <>
      {children}
      <MissionTable
        selectedMissionKey={selectedMissionKey}
        setEditMissionKey={setEditMissionKey}
        setOpenMissionModel={setOpenMissionModel}
        setSelectedMissionKey={setSelectedMissionKey}
        setSelectedMissionCar={setSelectedMissionCar}
        allMissionTitle={filterMissionData}
      />
    </>
  ) : (
    <MissionList
      selectedMissionKey={selectedMissionKey}
      setSelectedMissionKey={setSelectedMissionKey}
      selectedMissionCar={selectedMissionCar}
    />
  )
export default SwitchTable
