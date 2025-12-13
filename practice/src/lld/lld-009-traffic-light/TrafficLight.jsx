import { useState, useEffect } from "react";
import "./styles.css"

export default function TrafficLight(){
    const LIGHTS_CONFIG = {
        red: {
            backgroundColor: "red",
            duration: 4000,
            next: "green",
        },
        yellow: {
            backgroundColor: "yellow",
            duration: 900,
            next: "red",
        },
        green: {
            backgroundColor: "green",
            duration: 3000,
            next: "yellow",
        },
    };

    const [activeLight, setActiveLight] = useState("red");

    useEffect(()=>{
        const currentConfig = LIGHTS_CONFIG[activeLight];
        const timer = setTimeout(()=>{
            setActiveLight(currentConfig.next)
        }, currentConfig.duration)

        return ()=> clearTimeout(timer)
    }, [activeLight]);


    return(
        <div className="traffic-light-container">
            {Object.keys(LIGHTS_CONFIG).map((colorKey) =>{
                return <div key={colorKey} className="light" 
                style={{
                    backgroundColor: colorKey===activeLight ? LIGHTS_CONFIG[colorKey].backgroundColor : "", 
                }} />
            })}
        </div>
    )

}