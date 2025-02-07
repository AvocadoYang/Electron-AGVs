/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useAtom } from 'jotai'
import { EditLocationPanelSwitch, EditLocationListTableSwitch } from '@renderer/utils/siderGloble'
import { SideSwitchToShowForm } from '@renderer/utils/siderGloble'
import { useEffect } from 'react'
import { showBlockId } from '@renderer/utils/gloable'

const useResetSiderSwitch = () => {
  const [, setSideSwitchToShowForm] = useAtom(SideSwitchToShowForm)
  const [, setOpenEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [, setShowAllLocationListTable] = useAtom(EditLocationListTableSwitch)
  const [, setShowBlockId] = useAtom(showBlockId)
  useEffect(() => {
    setSideSwitchToShowForm(false)
    setShowAllLocationListTable(false)
    setOpenEditLocationPanel(false)
    setShowBlockId('')
  }, [])
}

export default useResetSiderSwitch
