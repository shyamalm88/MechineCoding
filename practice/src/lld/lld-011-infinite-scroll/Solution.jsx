import {useState, useRef, useEffect} from "react"


const fetchPosts = (page) =>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            const newItems = new Array(20);
            for(let i=0; i<20; i++){
                newItems[i] = {
                    id: Math.random() + Date.now(),
                    title: `This is post #${page * 20 + i+1} - this is the content`
                }
            }
            resolve(newItems)
        }, 1000)
    })
    
}

const InfiniteScroll = () => {
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const observerTarget = useRef(null);

    useEffect(()=>{
        const loadData = async()=>{
            setIsLoading(true);
            const newItems = await fetchPosts(page);
            setData((prev) => [...prev, ...newItems]);
            setIsLoading(false)

            if(newItems.length === 0) setHasMore(false);
        }
        loadData();
    }, [page])


    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=>{
            if(entries[0].isIntersecting && !isLoading && hasMore){
                setPage((prev)=> prev+1);
            }
        }, {threshold: 1.0})

        if(observerTarget.current){
            observer.observe(observerTarget.current)
        }

        return () =>{
            if(observerTarget.current){
                observer.unobserve(observerTarget.current);
            }
        }
    }, [isLoading, hasMore]);


    return(
        <div style={{maxWidth: "400px", margin: "0 auto", padding: "20px"}}>
            <ul>
                {data.map((item)=>{
                    return (
                        <li key={item.id} style={{padding: "20px", border: "1px solid #ccc", marginBottom: "10px", background: "#f7f7f7"}}>
                            {item.title}
                        </li>
                    )
                })}
            </ul>

            {hasMore && (
                <div ref={observerTarget} style={{height: "50px", textAlign: "center", padding: "10px", fontWeight: "bold"}}>
                    {isLoading ? "Loading" : "Scroll Down to load"}
                </div>
            )}
        </div>
    )
}

export default InfiniteScroll;