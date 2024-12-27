import { useAtom } from 'jotai'
import { modifyLoc as Loc, modifyRoad as Road, modifyZone as Zone } from '@renderer/utils/gloable'
import { useCallback } from 'react'
import { Modify } from '@renderer/utils/jotai'

type ModifyAction = 'add' | 'edit' | 'delete'
type ModifyGenre = 'loc' | 'road' | 'zone'

export const useModifyHandler = (): ((
  id: string,
  genre: ModifyGenre,
  action: ModifyAction
) => void) => {
  const [modifyLoc, setModifyLoc] = useAtom(Loc)
  const [modifyRoad, setModifyRoad] = useAtom(Road)
  const [modifyZone, setModifyZone] = useAtom(Zone)

  const modifyHandler = useCallback(
    (id: string, genre: ModifyGenre, action: ModifyAction): void => {
      const getModifyData = (): [Modify, React.Dispatch<React.SetStateAction<Modify>>] => {
        switch (genre) {
          case 'loc':
            return [modifyLoc, setModifyLoc]
          case 'road':
            return [modifyRoad, setModifyRoad]
          case 'zone':
            return [modifyZone, setModifyZone]
          default:
            throw new Error(`Unsupported genre: ${genre}`)
        }
      }

      const [staleModify, setModify] = getModifyData()

      let addList = [...staleModify.add]
      let editList = [...staleModify.edit]
      let deleteList = [...staleModify.delete]

      switch (action) {
        case 'add':
          addList = [...new Set([...addList, id])]
          editList = editList.filter((d) => d !== id)
          break
        case 'edit':
          if (!addList.includes(id)) {
            editList = [...new Set([...editList, id])]
            deleteList = deleteList.filter((d) => d !== id)
          }
          break
        case 'delete':
          if (addList.includes(id)) {
            addList = addList.filter((d) => d !== id)
          } else {
            deleteList = [...new Set([...deleteList, id])]
          }
          editList = editList.filter((d) => d !== id)
          break
        default:
          throw new Error(`Unsupported action: ${action}`)
      }

      const newModify: Modify = {
        add: addList,
        edit: editList,
        delete: deleteList
      }

      setModify(newModify)
    },
    [modifyLoc, setModifyLoc, modifyRoad, setModifyRoad, modifyZone, setModifyZone]
  )

  return modifyHandler
}

export default useModifyHandler
