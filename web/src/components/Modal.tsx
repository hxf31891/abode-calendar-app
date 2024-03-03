// external imports
import { TransitionStatus } from "react-transition-group/Transition";
import { Transition } from "react-transition-group";
import { useRef } from "react";
import CSS from "csstype";

// internal imports
import Portal from "./Portal";
// types
import { ModalProps } from "types/ui";

const duration = 300;

const defaultStyle = {
  transform: "translate(-50%, -65%)",
  opacity: 0,
  width: 600,
  maxWidth: "90%",
  padding: 18,
  background: "white",
  left: "50%",
  top: "50%",
  borderRadius: 14,
  boxShadow: "2px 2px 6px rgba(0,0,0,.2)",
  zIndex: -10,
};

const transitionStyles: Partial<Record<TransitionStatus, CSS.Properties>> = {
  entering: { opacity: 1, transform: "translate(-50%, -50%)", zIndex: 10000 },
  entered: { opacity: 1, transform: "translate(-50%, -50%)", zIndex: 10000 },
  exiting: { opacity: 0, transform: "translate(-50%, -65%)", zIndex: -10 },
  exited: { opacity: 0, transform: "translate(-50%, -65%)", zIndex: -10 },
};

function Modal({ open, title, children, handleClose }: ModalProps) {
  const nodeRef = useRef(null);
  const zIndexDuration = open ? 0 : 300;

  return (
    <Portal>
      {open && <div onClick={handleClose} className="blur-screen" />}
      <Transition
        in={open}
        nodeRef={nodeRef}
        timeout={duration}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        {(state) => (
          <div
            className="position-fixed"
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
              transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out, z-index ${zIndexDuration}ms ease-in-out ${zIndexDuration}ms`,
            }}
          >
            <div className="mb-4 d-flex justify-content-between">
              <h2>{title}</h2>
            </div>
            {children}
          </div>
        )}
      </Transition>
    </Portal>
  );
}

export default Modal;
