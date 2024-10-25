/* eslint-disable @typescript-eslint/explicit-function-return-type */
import useMap from '@renderer/api/useMap'
import { Spin } from 'antd'
import '../../setting.css'
import { LoadingOutlined, RobotOutlined } from '@ant-design/icons'

const MapImage = () => {
  const { data, isLoading, isError } = useMap()
  console.log(isError, isLoading)
  if (isLoading)
    return (
      <div
        style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 55 }} spin />} />
      </div>
    )
  if (isError)
    return (
      <div
        style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '50%',
            padding: '5px'
          }}
        >
          <p
            className="error-text"
            style={{ fontSize: '50px', marginBottom: '0', color: 'red', fontWeight: 'bold' }}
          >
            ⚠️
          </p>
          <RobotOutlined className="robot-icon" style={{ marginBottom: '20px' }} />
          <h1 className="error-text">Internal Server Error</h1>
          <h3 className="error-text">Oops! Something went wrong</h3>
          <h4 className="error-text">
            The server encountered an internal error or misconfiguration and was unable to complete
            your request
          </h4>
        </div>
      </div>
    )
  // if (!data) return <div className="error-image"></div>
  return (
    <>
      <img src={`${data.imageUrl}`} draggable={false} style={{ userSelect: 'none' }} />
    </>
  )
}

export default MapImage
