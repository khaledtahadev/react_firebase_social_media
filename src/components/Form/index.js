import styles from "./form.module.css";
import classnames from "classname";

const Form = ({ children, formComment, ...rest }) => {
	// classes
	const formClasses = classnames(styles.form, {
		[styles.formComment]: formComment,
	});

	return (
		<form className={formClasses} {...rest}>
			{children}
		</form>
	);
};

export default Form;
