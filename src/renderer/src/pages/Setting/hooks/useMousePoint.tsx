/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, RefObject } from 'react'
import { fromEvent, throttleTime, debounceTime, map, tap } from 'rxjs'
import { rvizCoord } from '@renderer/utils/utils'
import useMap from '@renderer/api/useMap'
import { FormInstance } from 'antd'

const useMousePoint = (
  mapWrapRef: RefObject<HTMLDivElement>,
  mapRef: RefObject<HTMLDivElement>,
  scale: number,
  setMousePointX: React.Dispatch<number>,
  setMousePointY: React.Dispatch<number>,
  locationPanelForm: FormInstance<unknown>,
  isMousePointStart: boolean
) => {
  const { data } = useMap()
  useEffect(() => {
    if (!mapWrapRef.current || !mapRef.current || !isMousePointStart || !data) return

    const clickEvent$ = fromEvent<MouseEvent>(mapRef.current, 'click').pipe(
      throttleTime(300),
      debounceTime(300),
      map(({ clientX, clientY }) => ({
        clientX,
        clientY
      })),
      tap(({ clientX, clientY }) => {
        if (!mapRef.current || !mapWrapRef.current) return
        const Left = mapWrapRef.current?.scrollLeft
        const Top = mapWrapRef.current?.scrollTop

        console.log(mapRef.current.offsetLeft, mapRef.current.offsetTop)

        const adjustX = clientX - mapRef.current.offsetLeft + (Left as number)
        const adjustY = clientY - mapRef.current.offsetTop - 64 + (Top as number)
        const [rx, ry] = rvizCoord({
          displayX: adjustX,
          displayY: adjustY,
          mapResolution: data?.mapResolution,
          mapOriginX: data?.mapOriginX,
          mapOriginY: data?.mapOriginY,
          mapHeight: data?.mapHeight,
          scaleSize: scale
        })

        setMousePointX(adjustX / scale)
        setMousePointY(adjustY / scale)
        locationPanelForm.setFieldValue('x', Number(rx.toFixed(5)))
        locationPanelForm.setFieldValue('y', Number(ry.toFixed(5)))
      })
    )

    const subscription = clickEvent$.subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [mapRef, mapWrapRef, scale, isMousePointStart])
}

export default useMousePoint
