/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useAtom } from 'jotai'
import {
  EditLocationPanelSwitch,
  StoredLocationSwitch,
  EditingLocationSwitch
} from '@renderer/utils/siderGloble'
import { useEffect } from 'react'
import { showBlockId } from '@renderer/utils/gloable'

const useResetSiderSwitch = () => {
  const [, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [, setShowStoredLocation] = useAtom(StoredLocationSwitch)
  const [, setShowEditingLocation] = useAtom(EditingLocationSwitch)
  const [, setShowBlockId] = useAtom(showBlockId)
  useEffect(() => {
    setOpenEditLocationPanel(false)
    setShowStoredLocation(true)
    setShowEditingLocation(false)
    setShowBlockId('')
  }, [])
}

export default useResetSiderSwitch
