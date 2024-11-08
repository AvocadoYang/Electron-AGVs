/* eslint-disable @typescript-eslint/explicit-function-return-type */
import './form.css'
import { useAtom } from 'jotai'
import { hoverLocation } from '@renderer/utils/gloable'
import { EditLocationListFormSwitch } from '@renderer/utils/siderGloble'
const AllLocationListForm = () => {
  const [, setHoverLoc] = useAtom(hoverLocation)
  const [showAllLocationListForm] = useAtom(EditLocationListFormSwitch)
  return (
    <>
      {showAllLocationListForm ? (
        <div className="form-wrap" onMouseLeave={() => setHoverLoc('')}></div>
      ) : null}
    </>
  )
}

export default AllLocationListForm
