import "./styles.css"
export default function Modal({title, children, primaryAction, secondaryAction, onClose, showClose=true}){
    return(<div className="overlay">
        <div className="modal">
            {showClose && <button className="close" onClick={onClose}>X</button>}
            <h3>{title}</h3>
            <div className="content">{children}</div>
            <div className="actions">
                {secondaryAction && <button onClick={secondaryAction.onClick}>{secondaryAction.label}</button>}
            </div>
            <div className="actions">
                {primaryAction && <button onClick={primaryAction.onClick}>{primaryAction.label}</button>}
            </div>
        </div>
    </div>)
}