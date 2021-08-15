import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// icons
import { MdNotifications, MdComment, MdFavorite } from "react-icons/md";
// styles
import styles from "./notifications.module.css";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { markedNotificationToRead } from "../../../redux/actions/userActions";
// timeFormate
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const Notifications = () => {
	const [showNotify, setShowNotify] = useState(false);
	const toggleNotify = useRef();
	const notifications = useSelector(state => state.user.notifications);
	const dispatch = useDispatch();

	const markedNotifcations = () => {
		const unReadNotifications = notifications
			.filter(notifi => !notifi.read)
			.map(notifi => notifi.notificationId);

		if (showNotify && unReadNotifications.length > 0) {
			dispatch(markedNotificationToRead(unReadNotifications));
		}
	};

	const handleOpenMenu = () => {
		setShowNotify(!showNotify);
	};

	const onClickOutsideNotifiyBox = e => {
		if (showNotify && !toggleNotify.current.contains(e.target)) {
			setShowNotify(false);
			markedNotifcations();
			window.removeEventListener("click", onClickOutsideNotifiyBox);
		}
	};

	useEffect(() => {
		if (showNotify) window.addEventListener("click", onClickOutsideNotifiyBox);
		return () => window.removeEventListener("click", onClickOutsideNotifiyBox);
	});

	const notificationIcon = notifications.filter(noti => noti.read === false)
		.length > 0 && (
		<span className={styles.badge}>
			{notifications.filter(noti => noti.read === false).length}
		</span>
	);

	dayjs.extend(relativeTime);
	const notificationsMarkup =
		notifications && notifications.length > 0 ? (
			notifications.map(notifi => {
				const verb = notifi.type === "like" ? "liked" : "comment on";
				const time = dayjs(notifi.createdAt).fromNow();
				const notifiType = notifi.type;
				const color = notifi.read ? "#ddd" : "red";
				const icon =
					notifiType === "like" ? (
						<MdFavorite color={color} className={styles.iconTypeNotification} />
					) : (
						<MdComment color={color} className={styles.iconTypeNotification} />
					);
				return (
					<li className={styles.notification} key={notifi.notificationId}>
						{icon}
						<Link
							to={`/users/${notifi.recipient}/scream/${notifi.screamId}`}
							className={styles.linkNotification}
						>
							{notifi.sender} {verb} your scream {time}
						</Link>
					</li>
				);
			})
		) : (
			<li className={styles.notification}>Not have notifications</li>
		);

	return (
		<div className={styles.notificationsBox} ref={toggleNotify}>
			<MdNotifications
				className={styles.iconNotifications}
				onClick={handleOpenMenu}
			/>
			{notificationIcon}
			{showNotify && (
				<ul className={styles.contentNotifications}>{notificationsMarkup}</ul>
			)}
		</div>
	);
};

export default Notifications;
