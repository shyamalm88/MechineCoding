export function addReply(tree, item, newComment){
    return tree.map((node)=>{
        if(node.id == item.id){
            return {...node, children: [...node.children, newComment ]}
        }
        return {...node, children: addReply(node.children, item, newComment)}
    })
}

export function updateComment(tree, item, text){
    return tree.map((node)=>{
        if(node.id == item.id){
            return {...node, text: text}
        }
        return {...node, children: updateComment(node.children, item, text)}
    })
}

export function deleteComment(tree, id){
    return tree.filter((node)=> node.id!==id).map((node)=>({...node, children: deleteComment(node.children, id)}))
}