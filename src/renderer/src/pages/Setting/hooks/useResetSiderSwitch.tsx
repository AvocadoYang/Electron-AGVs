/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useAtom } from 'jotai'
import {
  EditLocationPanelSwitch,
  StoredLocationSwitch,
  EditingLocationSwitch,
  EditLocationListFormSwitch
} from '@renderer/utils/siderGloble'
import { SideSwitchToShowForm } from '@renderer/utils/siderGloble'
import { useEffect } from 'react'
import { showBlockId } from '@renderer/utils/gloable'

const useResetSiderSwitch = () => {
  const [, setSideSwitchToShowForm] = useAtom(SideSwitchToShowForm)
  const [, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [, setShowStoredLocation] = useAtom(StoredLocationSwitch)
  const [, setShowEditingLocation] = useAtom(EditingLocationSwitch)
  const [, setShowAllLocationListForm] = useAtom(EditLocationListFormSwitch)
  const [, setShowBlockId] = useAtom(showBlockId)
  useEffect(() => {
    setSideSwitchToShowForm(false)
    setShowAllLocationListForm(false)
    setOpenEditLocationPanel(false)
    setShowStoredLocation(true)
    setShowEditingLocation(false)
    setShowBlockId('')
  }, [])
}

export default useResetSiderSwitch
