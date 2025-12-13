import { useState, useEffect } from "react";

export default function ProgressBar({isActive, isPaused, onComplete}){
  const [progress, setProgress] = useState(0);

useEffect(()=>{
    if(!isActive || isPaused || progress >= 100) return;
    const timer = setTimeout(()=>{
        setProgress((prev) =>{
            if(prev >= 100){
                clearInterval(timer);
                return;
            }
            return prev+1
        })
    }, 20)
    return () => clearTimeout(timer)
}, [isActive, isPaused, progress])

useEffect(() =>{
    if(progress >= 100){
        onComplete()
    }
}, [progress, onComplete])


  return(
    <div style={{height: 20, background: "#e0e0e0", margin: "10px 0", borderRadius: 5, overflow: 'hidden'}}>
      <div style={{
        height: "20px",
        width: `${progress}%`,
        background: progress >= 100 ? "green" : "#2196f3",
        transition: "width 20ms linear"
      }}></div>
    </div>
  )
}