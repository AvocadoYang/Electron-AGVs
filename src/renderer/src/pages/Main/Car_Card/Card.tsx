import { InfoWrap } from './components/InfoWrap'
import Battery from './components/Battery'
import {
  CarRow1,
  CarRow2,
  CarRow3,
  LogInStatus,
  CarStatus,
  AmrTitle,
  TextWrap
} from './components/Lists'
import './car_info.css'

const Card: React.FC = () => {
  return (
    <InfoWrap randomcolor={'red'} isstop={false}>
      <CarRow1>
        <LogInStatus login={true}></LogInStatus>
        <div className="car-name">
          <AmrTitle>{'anfa-ps14-16-002'}</AmrTitle>
        </div>
      </CarRow1>
      <CarRow2>
        <CarStatus>{'test car status 12333'}</CarStatus>
      </CarRow2>
      <CarRow3>
        <TextWrap style={{ width: '30%' }}>
          <p style={{ textAlign: 'center', marginBottom: '0.1em' }} className="tittle">
            {'θ'}
          </p>
          <p style={{ textAlign: 'center', marginBottom: '0.5em' }} className="value">
            {/* {((yaw: number | undefined) => {
                        if (yaw === undefined) return undefined;
                        return parseFloat(yaw.toFixed(2));
                      })(fleetInfo.originPose?.yaw)} */}
            {123}
          </p>
        </TextWrap>
        <TextWrap>
          {/* <p style={{ textAlign: 'center', marginBottom: '0.1em' }} className="tittle">
            {'Power'}
          </p> */}
          <p style={{ position: 'absolute', fontSize: '12px'}}>{'⚡︎'}</p>
          <Battery></Battery>
          <p style={{ textAlign: 'center', marginBottom: '0.5em' }} className="value">
            {/* {fleetInfo.data.IO?.battery} */}
            {'90%'}
          </p>
        </TextWrap>
        <TextWrap style={{ width: '40%' }}>
          <p style={{ textAlign: 'center', marginBottom: '0.1em' }} className="tittle">
            {'x/y'}
          </p>
          <p
            style={{
              textAlign: 'center',
              wordWrap: 'break-word',
              marginBottom: '0.5em'
            }}
            className="value"
          >
            {/* {((x: number | undefined, y: number | undefined) => {
                        if (x === undefined || y === undefined)
                          return undefined;
                        return `${x.toFixed(2)}/${y.toFixed(2)}`;
                      })(fleetInfo.originPose?.x, fleetInfo.originPose?.y)} */}
            {`112.3/123.1`}
          </p>
        </TextWrap>
      </CarRow3>
    </InfoWrap>
  )
}

export default Card
