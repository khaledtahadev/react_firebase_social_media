import styles from "./profile.module.css";

const ProfileSkeleton = () => {
	return (
		<>
			<div className={styles.imgUser} />
			<div className={styles.infoBox}>
				<p className={styles.infoText}></p>
				<p className={styles.infoText}></p>
				<p className={styles.infoText}></p>
				<p className={styles.infoText}></p>
				<p className={styles.infoText}></p>
			</div>
		</>
	);
};

export default ProfileSkeleton;
