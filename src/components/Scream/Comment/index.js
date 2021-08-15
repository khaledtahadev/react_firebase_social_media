import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import noimg from "../../../images/user.png";
import classname from "classname";
// styles
import styles from "./comment.module.css";
// icons
import { MdDelete } from "react-icons/md";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../../redux/actions/dataActions";

const Comment = ({ comment }) => {
	const dispatch = useDispatch();
	const userHandleAuth = useSelector(
		state => state.user.credentials.userHandle
	);
	const { loadingComment } = useSelector(state => state.ui);
	const { body, createdAt, userHandle, screamId, commentId } = comment;

	const handleDeleteComment = (screamId, commentId) => {
		dispatch(deleteComment(screamId, commentId));
	};

	dayjs.extend(relativeTime);

	// styles-logic
	const deleteIcon = classname(styles.deleteIcon, {
		[styles.disabledDeleteIcon]: loadingComment,
	});

	// Render
	return (
		<div className={styles.comment}>
			<img src={noimg} width='50' alt='noimg' className={styles.userimg} />
			<div className={styles.commentContent}>
				<p className={styles.username}>{userHandle}</p>
				<p className={styles.bodyComment}>{body}</p>
				<time dateTime={createdAt} className={styles.timeComment}>
					{dayjs(createdAt).fromNow()}
				</time>
			</div>
			{userHandleAuth === userHandle && (
				<MdDelete
					className={deleteIcon}
					onClick={() => handleDeleteComment(screamId, commentId)}
				/>
			)}
		</div>
	);
};

export default Comment;
