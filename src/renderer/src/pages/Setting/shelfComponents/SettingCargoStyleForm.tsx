import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  RedoOutlined,
  UndoOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons'
import { Button, Card, Col, Form, Input, message, Row } from 'antd'
import { useAtom } from 'jotai'
import { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { cargoStyle } from '@renderer/utils/gloable'
import client from '@renderer/api/axiosClient'
import { LocWithoutArr } from '@renderer/api/useLoc'
import { ErrorResponse } from '@renderer/utils/globalType'
import { errorHandler } from '@renderer/utils/utils'

type Options = 'areaType' | 'translateX' | 'translateY' | 'rotate' | 'scale'

type Val = {
  input: Options
  value: number
}

export type SubmitValue = {
  id: string
  translateX: number
  translateY: number
  rotate: number
  scale: number
}

type Event =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'r-rotate'
  | 'l-rotate'
  | 'scale-up'
  | 'scale-down'
  | ''

const BtnWrapper = styled.div`
  display: flex;
  gap: 1em;
`

const SettingCargoStyleForm: FC<{ selectId: string }> = ({ selectId }) => {
  const [cStyle, setCStyle] = useAtom(cargoStyle)
  const [form] = Form.useForm()
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)
  const targetIndex = cStyle.findIndex((v) => v.id === selectId)
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const submitMutation = useMutation({
    mutationFn: (editValue: SubmitValue) => {
      return client.post('api/setting/edit-loc-style', editValue)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['cargoLoc-mission']
      })
      messageApi.success(t('utils.success'))
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  })
  const saveStyle = () => {
    const x = form.getFieldValue('translateX') as number
    const y = form.getFieldValue('translateY') as number
    const r = form.getFieldValue('rotate') as number
    const s = form.getFieldValue('scale') as number

    submitMutation.mutate({
      id: selectId,
      translateX: x,
      translateY: y,
      rotate: r,
      scale: s
    })
  }

  const handChange = (val: Val) => {
    setCStyle((prev) => {
      const newC = [...prev]
      const stale = prev[targetIndex]

      const newData: LocWithoutArr = {
        id: stale.id,
        locationId: stale.locationId,
        areaType: stale.areaType,
        translateX: val.input === 'translateX' ? val.value : stale.translateX,
        translateY: val.input === 'translateY' ? val.value : stale.translateY,
        rotate: val.input === 'rotate' ? val.value : stale.rotate,
        scale: val.input === 'scale' ? val.value : stale.scale
      }

      newC[targetIndex] = newData

      return newC
    })
  }

  const handleBtnChange = (val: Val) => {
    setCStyle((prev) => {
      const newC = [...prev]
      const stale = prev[targetIndex]

      const newData: LocWithoutArr = {
        id: stale.id,
        locationId: stale.locationId,
        areaType: stale.areaType,
        translateX: val.input === 'translateX' ? val.value + stale.translateX : stale.translateX,
        translateY: val.input === 'translateY' ? val.value + stale.translateY : stale.translateY,
        rotate: val.input === 'rotate' ? val.value + stale.rotate : stale.rotate,
        scale: val.input === 'scale' ? val.value + stale.scale : stale.scale
      }

      newC[targetIndex] = newData

      return newC
    })
  }

  const transformStyle = (event: Event) => {
    switch (event) {
      case 'up':
        handleBtnChange({ input: 'translateY', value: -0.1 })
        break
      case 'down':
        handleBtnChange({ input: 'translateY', value: +0.1 })
        break
      case 'left':
        handleBtnChange({ input: 'translateX', value: -0.1 })
        break
      case 'right':
        handleBtnChange({ input: 'translateX', value: 0.1 })
        break
      case 'r-rotate':
        handleBtnChange({ input: 'rotate', value: -1 })
        break
      case 'l-rotate':
        handleBtnChange({ input: 'rotate', value: 1 })
        break
      case 'scale-up':
        handleBtnChange({ input: 'scale', value: 0.1 })
        break
      case 'scale-down':
        handleBtnChange({ input: 'scale', value: -0.1 })
        break
      default:
        console.log('error')
    }
  }

  useEffect(() => {
    //    console.log(cStyle.find((v) => v.id === selectId));

    form.setFieldValue('translateX', cStyle.find((v) => v.id === selectId)?.translateX)
    form.setFieldValue('translateY', cStyle.find((v) => v.id === selectId)?.translateY)
    form.setFieldValue('scale', cStyle.find((v) => v.id === selectId)?.scale)
    form.setFieldValue('rotate', cStyle.find((v) => v.id === selectId)?.rotate)
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectId, cStyle])

  // Function to handle the button press and start the transformations
  const handleButtonPress = (event: Event) => {
    if (intervalId.current) return
    transformStyle(event)
    intervalId.current = setInterval(() => {
      transformStyle(event)
    }, 50)
  }

  const stopCounter = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current)
      intervalId.current = null
    }
  }

  useEffect(() => {
    return () => stopCounter()
  }, [])

  return (
    <>
      {contextHolder}
      <Card>
        <Row gutter={[12, 24]}>
          <Col span={24}>
            {' '}
            <BtnWrapper>
              <Button onClick={() => saveStyle()} type="primary">
                {t('edit_shelf_panel.save')}
              </Button>
              <Button
                onMouseDown={() => handleButtonPress('up')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('up')}
                icon={<ArrowUpOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('down')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('down')}
                icon={<ArrowDownOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('left')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('left')}
                icon={<ArrowLeftOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('right')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('right')}
                icon={<ArrowRightOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('l-rotate')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('l-rotate')}
                icon={<RedoOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('r-rotate')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('r-rotate')}
                icon={<UndoOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('scale-up')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('scale-up')}
                icon={<FullscreenOutlined />}
              />
              <Button
                onMouseDown={() => handleButtonPress('scale-down')}
                onMouseUp={stopCounter}
                onClick={() => transformStyle('scale-down')}
                icon={<FullscreenExitOutlined />}
              />
            </BtnWrapper>
          </Col>
          <Col span={24}>
            {' '}
            <Form form={form} labelCol={{ span: 3 }} autoComplete="off">
              <Form.Item label="x" name="translateX">
                <Input
                  type="number"
                  onChange={(e) =>
                    handChange({
                      input: 'translateX',
                      value: Number(e.target.value)
                    })
                  }
                />
              </Form.Item>

              <Form.Item label="y" name="translateY">
                <Input
                  type="number"
                  onChange={(e) =>
                    handChange({
                      input: 'translateY',
                      value: Number(e.target.value)
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="scale" name="scale">
                <Input
                  type="number"
                  onChange={(e) =>
                    handChange({
                      input: 'scale',
                      value: Number(e.target.value)
                    })
                  }
                />
              </Form.Item>

              <Form.Item label="rotate" name="rotate">
                <Input
                  type="number"
                  onChange={(e) =>
                    handChange({
                      input: 'rotate',
                      value: Number(e.target.value)
                    })
                  }
                />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  )
}

export default SettingCargoStyleForm
