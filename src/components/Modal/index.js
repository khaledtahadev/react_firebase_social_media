import { forwardRef } from "react";
import styles from "./modal.module.css";

const Modal = forwardRef(({ children, showModal, ...rest }, ref) => {
	return (
		<>
			{showModal && (
				<div className={styles.modal} ref={ref} {...rest}>
					{children}
				</div>
			)}
		</>
	);
});

export default Modal;
