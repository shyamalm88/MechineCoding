import {useState, useEffect} from "react"

export function Folder({explorerData, handleInsertNode}){
  const [expanded, setExpanded] = useState(false);
  const [folderState, setFolderState] = useState({
    isVisible: false,
    isFolder: null 
  })

  const handleAddNode = (ev, isFolder) =>{
    
  }

  const handleAdd = (ev, isFolder) =>{
    ev.stopPropagation();
    setExpanded(true);
    setFolderState({
      isVisible: true,
      isFolder
    })
  }

  const handleFileName = (ev) =>{
    if(ev.keyCode===13){
      handleInsertNode(explorerData.id, ev.target.value, folderState.isFolder);
      setFolderState({...folderState, 
      isVisible: false,
      isFolder: null
    })
    }
  }

  return(
    <>
    <div style={{display: "flex", justifyContent: "space-between", maxWidth: "350px"}} onClick={()=>setExpanded(!expanded)}>
      <div style={{display: "flex", gap: 10}}>
        {explorerData?.isFolder ? expanded ? <span>📂</span> : <span>📁</span> : <span>📄</span>}
        <span>{explorerData.name}</span>
      </div>
      {explorerData?.isFolder && <div style={{display: "flex", gap: 5}}>
        <button onClick={(e)=>handleAdd(e, true)}>Folder +</button>
        <button onClick={(e)=>handleAdd(e, false)}>File +</button>
      </div>
      }
      
    </div>
    {expanded && 
    <div>
       {folderState?.isVisible && 
       <>
        <span>{folderState.isFolder ? "📁" : "📄"}</span>
        <input type="text" onKeyDown={handleFileName} onBlur={()=>setFolderState({...folderState,
            isVisible: false,
            isFolder: null
          })} autoFocus="true"/>
        </>
        }
        {explorerData?.items.map((item, index)=>{
          return <div style={{padding: "5px 10px"}}>
              <Folder key={index} explorerData={item} handleInsertNode={handleInsertNode}/>
            </div>
        })}
    </div>
    }
      
    </>
  )
}