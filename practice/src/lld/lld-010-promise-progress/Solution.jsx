import {useState} from "react";
import "./styles.css"

function PromiseProgress(){
    return new Promise((resolve, reject)=>{
        const duration = Math.random() * 3000 + 500;

        setTimeout(()=>{
            if(Math.random() > .7){
                reject(`${name} Failed`)
            } else{
                resolve(`${name} Success`)
            }
        }, duration)
    })
}


export default  function App(){
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const TOTAL_NUMBERS = 5;

    const serviceName = ["Auth", "Payment", "User Profile", "Notifications", "Analytics"];

    

    const handleStart = async () =>{
        setIsRunning(true);
        setProgress(0);
        setResults([]);
        
        const promises = serviceName.map((name) => {
        return PromiseProgress(name)
        .then((val)=>{
            setResults((prev) => [...prev, {status: "success", value: val}])
        })
        .catch(err=>{
            setResults((prev)=> [...prev, {status:"failed", value: err}])
        })
        .finally(()=>{
            setProgress((prev) => {
                const increment = 100 / TOTAL_NUMBERS;
                return Math.min(prev+increment, 100)
            })
        })
    });
    await Promise.allSettled(promises)
    setIsRunning(false)
    }


    return (
        <>
        <div className="progress-track">
            <div className="progress-fill" style={{width: `${progress}%`, background: progress===100 ? "green" : "blue"}}></div>
        </div>
        <button onClick={handleStart} disabled={isRunning}>{isRunning? "processing" : "Start Services"}</button>  
    </>  
)

}