import { forwardRef } from "react";
import styles from "./field.module.css";
import classnames from "classname";

const Field = forwardRef(
	({ label, error, textarea, smallField, ...rest }, ref) => {
		// classes
		const inputClasses = classnames(styles.inputField, {
			[styles.inputFieldSmall]: smallField,
		});
		const labelClasses = classnames(styles.labelField, {
			[styles.labelFieldSmall]: smallField,
		});

		// Render
		return (
			<div className={styles.fieldBox}>
				{label && <label className={labelClasses}>{label}</label>}
				{!textarea ? (
					<input
						className={inputClasses}
						// autoComplete='off'
						ref={ref}
						{...rest}
					/>
				) : (
					<textarea
						className={styles.inputFieldTextarea}
						ref={ref}
						{...rest}
					></textarea>
				)}

				{error && <span className={styles.error}>{error}</span>}
			</div>
		);
	}
);

export default Field;
