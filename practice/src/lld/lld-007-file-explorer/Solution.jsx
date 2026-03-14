import { useEffect, useState } from "react";

import { data } from "./data";
import { Folder } from "./Folder";

export default function App() {
  const [explorerData, setExplorerData] = useState(data);

  const insertNode = (folderId, itemName, isFolder) => {
    const copyNode = structuredClone(explorerData);

    function traverse(node) {
      if (node.id === folderId && node.isFolder) {
        node.items.unshift({
          id: Date.now(),
          name: itemName,
          isFolder,
          items: [],
        });

        return true; // stop traversal
      }

      if (!node.items) return false;

      for (const child of node.items) {
        if (traverse(child)) {
          return true;
        }
      }

      return false;
    }

    traverse(copyNode);

    return copyNode;
  };

  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  return (
    <Folder explorerData={explorerData} handleInsertNode={handleInsertNode} />
  );
}
