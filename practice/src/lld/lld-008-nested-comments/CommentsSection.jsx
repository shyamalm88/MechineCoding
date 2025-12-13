import { useCallback } from "react";
import { CommentsItem } from "./CommentItems";
import { addReply, updateComment, deleteComment } from "./CommentsHelper";
import {initialComments} from "./data"
import {useState} from "react";

export default function CommentsSection(){
    const [commentsData, setCommentsData] = useState(initialComments);

    const handleReply = useCallback((item, text) =>{
        if(!text.trim()) return;
        const newComment = {
            id: Date.now()+Math.random()*10,
            author: "You",
            text: text,
            children: []
        }
        setCommentsData(prev => addReply(prev, item, newComment))

    }, [])

    const handleEdit = useCallback((item, text) =>{
        setCommentsData(prev => updateComment(prev, item, text))
    }, [])

    const handleDelete = useCallback((item) =>{
        setCommentsData(prev=> deleteComment(prev, item.id))
    }, [])


    return(<div style={{padding: 16, maxWidth: "100%"}}>
        {commentsData.map((item)=>{
            return <CommentsItem onEdit={handleEdit} onDelete={handleDelete} onReply={handleReply} key={item.id} comment={item}/>
        })}
    </div>)
}