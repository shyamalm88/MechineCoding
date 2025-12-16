import { useModal } from "./ModalContext";
import Modal from "./Modal";

export default function ModalRoot() {
  const { modal, closeModal } = useModal();

  return (
    <>
      {modal.map((modal) => (
        <Modal
          key={modal.id}
          {...modal}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </>
  );
}
