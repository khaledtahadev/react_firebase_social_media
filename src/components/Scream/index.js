import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeButtons from "./LikeButtons";
import ScreamDialog from "./ScreamDialog";
import BoxLikeComment from "./BoxLikeComment";
// icons
import { MdComment, MdDelete } from "react-icons/md";
// style
import styles from "./scream.module.css";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { deleteScream } from "../../redux/actions/dataActions";

dayjs.extend(relativeTime);
// main
const Scream = ({ scream, openDailog }) => {
	const dispatch = useDispatch();
	const userHandleAuth = useSelector(
		state => state.user.credentials.userHandle
	);

	const {
		userAvatarURL,
		userHandle,
		createdAt,
		body,
		commentCount,
		likeCount,
		screamId,
	} = scream;

	const handleDelteScream = screamId => {
		dispatch(deleteScream(screamId));
	};

	return (
		<div className={styles.scream}>
			<img
				src={userAvatarURL}
				alt='profileImg'
				className={styles.imgScream}
				width='100'
				height='100'
			/>
			<div className={styles.screamContent}>
				<h3 className={styles.username}>
					<Link to={`/users/${userHandle}`}>{userHandle}</Link>
				</h3>
				<p className={styles.body}>{body}</p>
				<time dateTime={createdAt} className={styles.time}>
					{dayjs(createdAt).fromNow()}
				</time>
				<div className={styles.containerLikeComment}>
					<BoxLikeComment count={commentCount} type='comment'>
						<MdComment className={styles.commentIcon} />
					</BoxLikeComment>
					<BoxLikeComment count={likeCount} type='likes'>
						<LikeButtons screamId={screamId} />
					</BoxLikeComment>
					{/* dialog */}
					<ScreamDialog
						screamId={scream.screamId}
						userHandle={userHandle}
						openDailog={openDailog}
					/>
				</div>
			</div>
			{userHandleAuth === userHandle && (
				<MdDelete
					className={styles.deleteIcon}
					onClick={() => handleDelteScream(screamId)}
				/>
			)}
		</div>
	);
};

export default Scream;
