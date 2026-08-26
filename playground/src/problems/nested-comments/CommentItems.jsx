import {useState} from "react";
export function CommentsItem({comment, onReply, onEdit, onDelete}){
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [replyText, setReplyText] = useState("")

    return(
        <div style={{marginLeft: "20px", marginTop: 12}}>
            {isEditing ? <>
                <input type="text" value={editText} onChange={(e)=>setEditText(e.target.value)}/>
                <button onClick={()=>{onEdit(comment, editText); setIsEditing(false)}}>Submit</button>
            </> : <span>
                    <span>{comment.text}</span>
                    <br/>
                    author: <b>{comment.author}</b>
                </span>}
                <div>
                    <button onClick={()=>{setIsReplying(v=> !v)}}>Reply</button>
                    <button onClick={()=>{setIsEditing(v=> !v)}}>Edit</button>
                    <button onClick={()=>{onDelete(comment)}}>Delete</button>
                </div>
                {isReplying && (
                    <div style={{marginTop: 0}}>
                        <input type="text" value={replyText} onChange={(ev)=>setReplyText(ev.target.value)} placeholder="write a reply..."/>
                        <button onClick={()=> {onReply(comment, replyText); setReplyText(""); setIsReplying(false)}}>Save</button>
                    </div>

                )}

                {comment?.children?.map(child=>{
                    return <CommentsItem key={child.id} comment={child} onReply={onReply} onDelete={onDelete} onEdit={onEdit}/>
                })}
        </div>

    )
}