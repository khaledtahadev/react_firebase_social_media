import styles from "./Scream.module.css";

const ScreamSkeleton = () => {
	return (
		<div className={styles.ScreamSkeleton}>
			<div className={styles.imgScream}></div>
			<div className={styles.screamContent}>
				<p className={styles.text}></p>
				<p className={styles.bodyText}></p>
				<p className={styles.text}></p>
				<div className={styles.containerLikeComment}>
					<span className={styles.icon}></span>
					<span className={styles.icon}></span>
					<span className={styles.icon}></span>
				</div>
			</div>
		</div>
	);
};

export default ScreamSkeleton;
