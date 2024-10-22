/* eslint-disable @typescript-eslint/explicit-function-return-type */
const useModifyHandler = () => {
  const addModifyHandler = (id: string, genre: 'loc' | 'road' | 'zone') => {
    let staleModify = { ...modifyLoc };

    if (genre === 'road') staleModify = { ...modifyRoad };
    if (genre === 'zone') staleModify = { ...modifyZone };

    const addList = [...staleModify.add, id];

    const editList = [...staleModify.edit].filter((d) => d !== id);
    // const deleteList = [...staleModify.delete].filter((d) => d !== id);
    // 有可能刪除後新增
    const deleteList = [...staleModify.delete];

    const newModify: Modify = {
      add: [...new Set(addList)] as string[],
      edit: editList,
      delete: deleteList,
    };

    if (genre === 'loc') {
      setModifyLoc(newModify);
    }

    if (genre === 'road') {
      setModifyRoad(newModify);
    }

    if (genre === 'zone') {
      setModifyZone(newModify);
    }
  };

  const editModifyHandler = (id: string, genre: 'loc' | 'road' | 'zone') => {
    let staleModify = { ...modifyLoc };

    if (genre === 'road') staleModify = { ...modifyRoad };
    if (genre === 'zone') staleModify = { ...modifyZone };

    const existInAdd = modifyLoc.add.findIndex((f) => f === id);

    if (existInAdd !== -1) return;

    const editList = [...staleModify.edit, id];
    const deleteList = [...staleModify.delete].filter((d) => d !== id);

    const newModify: Modify = {
      add: staleModify.add,
      edit: [...new Set(editList)] as string[],
      delete: deleteList,
    };

    if (genre === 'loc') {
      setModifyLoc(newModify);
    }

    if (genre === 'road') {
      setModifyRoad(newModify);
    }

    if (genre === 'zone') {
      setModifyZone(newModify);
    }
  };

  const deleteModifyHandler = (id: string, genre: 'loc' | 'road' | 'zone') => {
    let staleModify = { ...modifyLoc };

    if (genre === 'road') staleModify = { ...modifyRoad };
    if (genre === 'zone') staleModify = { ...modifyZone };

    const existInAdd = staleModify.add.findIndex((f) => f === id);

    const deleteList =
      existInAdd !== -1 ? [...staleModify.delete] : [...staleModify.delete, id];

    const addList = [...staleModify.add].filter((d) => d !== id);
    const editList = [...staleModify.edit].filter((d) => d !== id);

    const newModify: Modify = {
      add: addList,
      edit: editList,
      delete: [...new Set(deleteList)] as string[],
    };

    if (genre === 'loc') {
      setModifyLoc(newModify);
    }

    if (genre === 'road') {
      setModifyRoad(newModify);
    }

    if (genre === 'zone') {
      setModifyZone(newModify);
    }
  };

}


export default useModifyHandler
