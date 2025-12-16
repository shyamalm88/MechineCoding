import { ModalProvider, useModal } from "./ModalContext";
import ModalRoot from "./ModalRoot";

export  function Page() {
  const { openModal, closeModal } = useModal();

  const openLowPriority = () => {
    openModal({
      id: "low",
      title: "Low Priority Modal",
      priority: 1,
      children: "Low priority content",
      primaryAction: {
        label: "Escalate",
        onClick: () => {
          openModal({
            id: "high",
            title: "High Priority Modal",
            priority: 10,
            children: "High priority content",
            primaryAction: {
              label: "Confirm",
              onClick: () => alert("Confirmed"),
            },
            secondaryAction: {
                label: "Back",
                onClick: () => {closeModal("high")},
            },
          });
        },
      },
    });
  };

  return <button onClick={openLowPriority}>Open Low Modal</button>;
}

export default function App() {
  return (
    <ModalProvider>
      <Page />
      <ModalRoot />
    </ModalProvider>
  );
}
