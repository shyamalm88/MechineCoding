import { useState } from "react";
import ProgressBar from "./progressBar";

export default function ProgressManager(){
  const LIMIT = 3;
  const [bars, setBars] = useState([Date.now()])
  const [isPaused, setIsPaused] = useState(true);
  const [finishCount, setFinnishCount] = useState(0);

  const togglePause = () =>{
    setIsPaused((prev)=> !prev);
  }

  const addBar = ()=>{
    setBars((prev)=> [...prev, Date.now() + Math.random()])
  }

  const reset = () =>{
    setBars([Date.now()]);
    setFinnishCount(0);
    setIsPaused(true);
  }

  const handleComplete = (index) =>{
    if(index === finishCount){
      setFinnishCount(prev => prev+1)
    }
  }




  return(
    <div style={{maxWidth: 400, margin: "20px auto"}}>
      <div style={{display: "flex", gap: 10, marginBottom: 20}}>
        <button onClick={togglePause}>{isPaused ? "Start" : "Pause"}</button>
        <button onClick={addBar}>Add</button>
        <button onClick={reset}>Reset</button>
      </div>

      
      <>
        {bars.map((id, index)=>{
          const isActive = index >= finishCount && index < finishCount+LIMIT
          return (
            <ProgressBar
              key={id}
              isActive={isActive}
              isPaused={isPaused}
              onComplete={()=> handleComplete(index)}
            />
          )
        })}
      </>
    </div>
  )
}