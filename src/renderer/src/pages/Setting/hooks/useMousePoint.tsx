/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, RefObject } from 'react'
import { fromEvent, throttleTime, debounceTime, map, tap } from 'rxjs'
import { rvizCoord } from '@renderer/utils/utils'
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
  useEffect(() => {
    if (!mapWrapRef.current || !mapRef.current || !isMousePointStart) return

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

        const adjustX = clientX - mapRef.current.offsetLeft + (Left as number)
        const adjustY = clientY - mapRef.current.offsetTop + (Top as number)
        const [rx, ry] = rvizCoord({
          displayX: adjustX,
          displayY: adjustY,
          mapResolution: 0.05,
          mapOriginX: -70.711403,
          mapOriginY: -8.826561,
          mapHeight: 608,
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
