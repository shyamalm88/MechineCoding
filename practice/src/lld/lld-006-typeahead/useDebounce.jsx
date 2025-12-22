import {useState, useEffect} from "react"

export default function useDebounceValue(value, delay){
    const [debouncedValue, setDebouncedValue] = useState("");

    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay)
        return ()=> clearTimeout(handler);
    }, [value])

    return debouncedValue;
}