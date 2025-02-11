/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useAtom } from 'jotai'
import {
  EditLocationPanelSwitch,
  EditLocationListTableSwitch,
  SideSwitchToShowForm,
  QuickEditLocationPanelSwitch,
  EditRoadPanelSwitch,
  EditZoneSwitch
} from '@renderer/utils/siderGloble'
import { useEffect } from 'react'
import { showBlockId } from '@renderer/utils/gloable'

const useResetSiderSwitch = () => {
  const [, setSideSwitchToShowForm] = useAtom(SideSwitchToShowForm)
  const [, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [, setEditRoadPanelSwitch] = useAtom(EditRoadPanelSwitch)
  const [, setQuickEditLocationPanel] = useAtom(QuickEditLocationPanelSwitch)
  const [, setShowAllLocationListTable] = useAtom(EditLocationListTableSwitch)
  const [, setOpenEditZone] = useAtom(EditZoneSwitch)
  const [, setShowBlockId] = useAtom(showBlockId)
  useEffect(() => {
    setSideSwitchToShowForm(false)
    setShowAllLocationListTable(false)
    setOpenEditLocationPanel(false)
    setEditRoadPanelSwitch(false)
    setQuickEditLocationPanel(false)
    setOpenEditZone(false)
    setShowBlockId('')
  }, [])
}

export default useResetSiderSwitch
