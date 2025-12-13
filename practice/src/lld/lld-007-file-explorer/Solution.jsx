import { useEffect, useState } from "react";

import { data } from "./data";
import { Folder } from "./Folder";
import { insertNode } from "./utils";

export default function App() {
  const [explorerData, setExplorerData] = useState(data);

  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  return (
    <Folder explorerData={explorerData} handleInsertNode={handleInsertNode} />
  );
}
