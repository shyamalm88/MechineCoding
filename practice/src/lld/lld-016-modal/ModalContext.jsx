import {createContext, useContext, useState} from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }){
const [modal, setModal] = useState([]);

const openModal = (modal)=>{
    setModal((prev) =>{
        const filtered = prev.filter(m=>m.priority >= modal.priority);
        return [...filtered, modal]
    })
}

const closeModal = (id) =>{
    setModal((prev) =>prev.filter((m)=> m.id != id))
}

const closeAll = () => setModal([]);

return (<ModalContext.Provider value={{modal, openModal, closeModal, closeAll}}>
    {children}
</ModalContext.Provider>)
}