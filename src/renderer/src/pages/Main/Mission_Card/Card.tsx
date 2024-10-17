import { InfoWrap, CardRow1 } from './components/WrapAndLists'
import { FileOutlined, CloseSquareOutlined } from '@ant-design/icons'
import './mission_info.css'
const Card: React.FC = () => {
  return (
    <InfoWrap>
      <CardRow1>
        <div className="row1-file" style={{ width: '20%' }}>
          <FileOutlined />
        </div>
        <div className="row1-status" style={{ width: '60%' }}>
          {'測試任務是否'}
        </div>
        <div className="row1-cancel" style={{ width: '20%'}}>
          <CloseSquareOutlined />
        </div>
      </CardRow1>
    </InfoWrap>
  )
}

export default Card
