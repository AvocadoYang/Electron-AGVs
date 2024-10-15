import { InfoWrap } from './components/InfoWrap'
import { CarRow1 } from './components/Lists'

const Card: React.FC = () => {
  return (
    <InfoWrap randomColor={'red'} isStop={false}>
      <CarRow1></CarRow1>
    </InfoWrap>
  )
}

export default Card
