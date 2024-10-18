/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, RefObject, useState } from 'react'
import { fromEvent, throttleTime, debounceTime, map, tap, merge } from 'rxjs'
import { rvizCoord } from '@renderer/utils/utils'

export const useMousePoint = (
  mapWrapRef: RefObject<HTMLDivElement>,
  mapRef: RefObject<HTMLDivElement>,
  scale: number
) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [locationPanelPositionX, setLocationPanelPositionX] = useState(-1)
  const [locationPanelPositionY, setLocationPanelPositionY] = useState(-1);
  useEffect(() => {
    if (!mapWrapRef.current || !mapRef.current) return
    const scrollEvent$ = fromEvent(mapWrapRef.current, 'scroll')
    const initScrollEvent = scrollEvent$
      .pipe(
        throttleTime(300),
        debounceTime(300),
        map((e) => ({
          scrollEvent: e
        })),
        tap(({ scrollEvent }) => {
          const target = scrollEvent.target as HTMLElement
          setScrollTop(target.scrollTop)
          setScrollLeft(target.scrollLeft)
        })
      )
      .subscribe()

    const combinedEvent$ = merge(
      scrollEvent$.pipe(
        tap(() => initScrollEvent.unsubscribe()),
        throttleTime(300),
        debounceTime(300),
        map((e) => ({
          scrollEvent: e
        })),
        tap(({ scrollEvent }) => {
          // console.log('ren1');
          const target = scrollEvent.target as HTMLElement
          setScrollTop(target.scrollTop)
          setScrollLeft(target.scrollLeft)
        })
      ),
      fromEvent<MouseEvent>(mapRef.current, 'click').pipe(
        throttleTime(300),
        debounceTime(300),
        map(({ clientX, clientY }) => ({
          clientX,
          clientY
        })),
        tap(({ clientX, clientY }) => {
          if (!mapRef.current) return
          //  console.log('ren2');

          const adjustX = clientX - mapRef.current.offsetLeft + scrollLeft
          const adjustY = clientY - mapRef.current.offsetTop + scrollTop
          const [rx, ry] = rvizCoord({
            displayX: adjustX,
            displayY: adjustY,
            mapResolution: 0.05,
            mapOriginX: -70.711403,
            mapOriginY: -8.826561,
            mapHeight: 608,
            scaleSize: scale
          })
          // console.log(rx, ry);
          setLocationPanelPositionX(adjustX / scale)
          setLocationPanelPositionY(adjustY / scale)
          // formLocation.setFieldValue('x', Number(rx.toFixed(5)))
          // formLocation.setFieldValue('y', Number(ry.toFixed(5)))
        })
      )
    )
  })
}
