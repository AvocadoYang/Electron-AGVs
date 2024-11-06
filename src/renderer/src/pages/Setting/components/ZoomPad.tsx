/* eslint-disable react/prop-types */
import styled from 'styled-components'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import useMap from '@renderer/api/useMap'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { memo } from 'react'

const ZoomPadWrap = styled.div`
  position: absolute;
  z-index: 4;
  bottom: 15px;
  right: 15px;
`

const ZoomPad: React.FC<{ setScale: React.Dispatch<React.SetStateAction<number>> }> = ({
  setScale
}) => {
  const { data, isError } = useMap()
  const { t } = useTranslation()
  if (isError || !data) return
  return (
    <ZoomPadWrap>
      <Button.Group>
        <Button onClick={() => setScale((pre) => pre + 0.035)} icon={<PlusOutlined />}>
          {t('zoom_in')}
        </Button>
        <Button
          onClick={() =>
            setScale((pre) => {
              return pre - 0.035
            })
          }
          icon={<MinusOutlined />}
        >
          {t('zoom_out')}
        </Button>
      </Button.Group>
    </ZoomPadWrap>
  )
}

export default memo(ZoomPad)
