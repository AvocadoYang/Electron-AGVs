import PadSider from './components/PadSider'
import PadContent from './components/PadContent'
import { memo } from 'react'
const PadView = () => {
  return (
    <>
      <PadSider></PadSider>
      <PadContent></PadContent>
    </>
  )
}

export default memo(PadView)
