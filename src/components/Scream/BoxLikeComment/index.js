import styles from "./BoxLikeComment.module.css";

const BoxLikeComment = ({ count, type, children }) => {
	const text = type === "likes" ? "likes" : "comments";
	return (
		<div className={styles.boxLikeComment}>
			{children}
			<span className={styles.countText}>
				{count} {text}
			</span>
		</div>
	);
};

export default BoxLikeComment;
