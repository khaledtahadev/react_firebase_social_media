import styles from "./button.module.css";
import classnames from "classname";

const Button = ({ children, largeButton, smallButton, ...rest }) => {
	const buttonStyle = classnames(styles.button, {
		[styles.largeButton]: largeButton,
		[styles.smallButton]: smallButton,
	});

	return (
		<button className={buttonStyle} {...rest}>
			{children}
		</button>
	);
};

export default Button;
