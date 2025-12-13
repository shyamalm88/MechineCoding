export const insertNode = (explorerData, folderId, itemName, isFolder) =>{
  const copyNode = structuredClone(explorerData);

  const traverse = (node) =>{
    if(node.id === folderId && node.isFolder){
      node.items.unshift({
        name: itemName,
        id: Date.now(),
        items: [],
        isFolder
      })
    }

    for(let child of node.items){
      const found = traverse(child);
      if(found){
        return true
      }
    }
  }
  traverse(copyNode);
  return copyNode;
}