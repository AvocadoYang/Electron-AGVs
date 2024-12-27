import { useAtom } from 'jotai'
import { modifyLoc as Loc } from '@renderer/utils/gloable'
import { useCallback } from 'react'

type ModifyAction = 'add' | 'edit' | 'delete'

export const useModifyHandler = (): ((id: string, action: ModifyAction) => void) => {
  const [modifyLoc, setModifyLoc] = useAtom(Loc)

  const modifyHandler = useCallback(
    (id: string, action: ModifyAction) => {
      const staleModify = { ...modifyLoc }

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

      const newModify = {
        add: addList,
        edit: editList,
        delete: deleteList
      }

      setModifyLoc(newModify)
    },
    [modifyLoc, setModifyLoc]
  )

  return modifyHandler
}

export default useModifyHandler
