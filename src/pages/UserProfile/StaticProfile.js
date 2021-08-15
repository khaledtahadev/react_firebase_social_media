import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import noImg from "../../images/user.png";
import ProfileSkeleton from "../../util/Skeleton/Profile";
// icons
import { getUserDetails } from "../../handlers/users";
import { MdLocationOn, MdLink, MdDateRange } from "react-icons/md";
// Styles
import styles from "./userProfile.module.css";

const StaticProfile = props => {
	const [loading, setLoading] = useState(true);
	const [credentials, setCredentials] = useState({});

	useEffect(() => {
		let isCancelled = false;

		const userDetails = async () => {
			try {
				const data = await getUserDetails(props.userHandle);
				if (!isCancelled) {
					setCredentials(data.userCredentials);
					setLoading(false);
				}
			} catch (error) {
				if (!isCancelled) {
					setCredentials(error.message);
					setLoading(false);
				}
			}
		};
		userDetails();

		return () => {
			isCancelled = true;
		};
	}, [props.userHandle]);

	dayjs.extend(relativeTime);
	return (
		<div className={styles.userProfile}>
			<div className={styles.content}>
				{!loading ? (
					typeof credentials === "object" && credentials !== null ? (
						<>
							<img
								src={credentials.avatarURL || noImg}
								className={styles.imgUser}
								alt='imgUser'
								width='100'
								height='100'
							/>
							<div className={styles.infoBox}>
								<p>@{credentials.userHandle}</p>
								{credentials.bio && <p>{credentials.bio}</p>}
								{credentials.location && (
									<p>
										<MdLocationOn className={styles.icon} />{" "}
										{credentials.location}
									</p>
								)}
								{credentials.websiteUrl && (
									<p>
										<MdLink className={styles.icon} />
										<a href='http://google.com'>{credentials.websiteUrl}</a>
									</p>
								)}
								<p>
									<MdDateRange className={styles.icon} />
									{dayjs(credentials.createdAt).fromNow()}
								</p>
							</div>
						</>
					) : (
						<p>Sorry No User</p>
					)
				) : (
					<ProfileSkeleton />
				)}
			</div>
		</div>
	);
};

export default StaticProfile;
