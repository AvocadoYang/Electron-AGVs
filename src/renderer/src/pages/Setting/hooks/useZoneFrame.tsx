import useMap from '@renderer/api/useMap'
import { EditZoneSwitch } from '@renderer/utils/siderGloble'
import { useAtomValue } from 'jotai'
import { RefObject, useEffect, useState } from 'react'
import { fromEvent, map, switchMap, takeUntil, tap, EMPTY, throttleTime, debounceTime } from 'rxjs'
import { rvizCoord } from '@renderer/utils/utils'

const useZoneFrame = (
  mapWrapRef: RefObject<HTMLDivElement>,
  mapRef: RefObject<HTMLDivElement>,
  mapImageRef: RefObject<HTMLImageElement>,
  scale: number,
  setIsDragging: React.Dispatch<boolean>
) => {
  const { data } = useMap()
  const openEditZone = useAtomValue(EditZoneSwitch)

  useEffect(() => {
    if (!mapWrapRef.current || !mapRef.current || !mapImageRef.current || !data || !openEditZone)
      return
    const mapPanel = mapRef.current
    const mapWrap = mapWrapRef.current

    // RxJS 事件流: 點擊開始拖曳
    const mouseDown$ = fromEvent<MouseEvent>(mapPanel, 'mousedown').pipe(
      tap(() => {
        console.log('?????????????????????')
        setIsDragging(true)
      }),
      switchMap((startEvent) => {
        if (!mapPanel || !mapWrap) return EMPTY

        const startX = startEvent.clientX - mapPanel.offsetLeft + mapWrap.scrollLeft
        const startY = startEvent.clientY - mapPanel.offsetTop + mapWrap.scrollTop

        return fromEvent<MouseEvent>(mapRef.current, 'mousemove').pipe(
          map((moveEvent) => {
            const endX = moveEvent.clientX - mapPanel.offsetLeft + mapWrap.scrollLeft
            const endY = moveEvent.clientY - mapPanel.offsetTop + mapWrap.scrollTop

            return {
              startX: startX / scale,
              startY: startY / scale,
              endX: endX / scale,
              endY: endY / scale
            }
          }),
          tap(({ startX, startY, endX, endY }) => {
            // console.log('繪製矩形範圍:', { startX, startY, endX, endY })
            // 這裡可以傳遞矩形範圍給 state 或其他處理函數
          }),
          takeUntil(
            fromEvent<MouseEvent>(mapPanel, 'mouseup').pipe(tap(() => setIsDragging(false)))
          ) // 當 mouseup 發生時，結束事件流
        )
      })
    )

    const subscription = mouseDown$.subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [mapRef, mapWrapRef, scale, openEditZone])

  return null
}

export default useZoneFrame
