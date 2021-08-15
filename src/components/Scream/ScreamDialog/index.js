import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Modal, Button, Field, Form } from "../..";
import BoxLikeComment from "../BoxLikeComment";
import Comment from "../Comment";
import LikeButtons from "../LikeButtons";
import { ScreamSkeleton } from "../../../util/Skeleton";
// icons
import { MdUnfoldMore, MdComment } from "react-icons/md";
// Style
import styles from "./screamDialog.module.css";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addComment, oneScream } from "../../../redux/actions/dataActions";

const ScreamDialog = ({ screamId, userHandle: handle, openDailog }) => {
	const { register, handleSubmit, formState, reset } = useForm();
	const { errors } = formState;
	const refModal = useRef();
	const [showModal, setShowModal] = useState(false);
	const [oldPath, setOldPath] = useState("");
	const dispatch = useDispatch();
	const { comments, ...scream } = useSelector(state => state.data.scream);
	const {
		userAvatarURL,
		userHandle,
		createdAt,
		body,
		commentCount,
		likeCount,
	} = scream;
	const loading = useSelector(state => state.ui.loading);
	const loadingComment = useSelector(state => state.ui.loadingComment);
	const authenticated = useSelector(state => state.user.authenticated);

	const handleOnSubmit = ({ comment }) => {
		dispatch(addComment(comment, screamId));
		reset();
	};

	const handleOpenDialog = () => {
		let oldPath = window.location.pathname;
		let newPath = `/users/${handle}/scream/${screamId}`;
		if (oldPath === newPath) oldPath = `/users/${handle}`;
		window.history.pushState(null, null, newPath);

		setOldPath(oldPath);
		setShowModal(true);
		dispatch(oneScream(screamId)); //to get one scream and it's comments
	};

	const handleClickOutContentModal = e => {
		if (refModal.current === e.target) {
			window.history.pushState(null, null, oldPath);
			setShowModal(false);
		}
	};

	useEffect(() => {
		if (openDailog) {
			handleOpenDialog();
		}
	}, [openDailog]);

	dayjs.extend(relativeTime);

	return (
		<>
			<div className={styles.buttonDialog}>
				<MdUnfoldMore className={styles.exandMore} onClick={handleOpenDialog} />
			</div>

			<Modal
				showModal={showModal}
				onClick={handleClickOutContentModal}
				ref={refModal}
			>
				<div className={styles.contentModal}>
					{!loading ? (
						<>
							<div className={styles.scream}>
								<img
									src={userAvatarURL}
									alt='profileImg'
									className={styles.imgScream}
									width='100'
									height='100'
								/>
								<div className={styles.screamContent}>
									<h3 className={styles.username}>{userHandle}</h3>
									<time dateTime={createdAt} className={styles.time}>
										{dayjs(createdAt).fromNow()}
									</time>
									<p className={styles.body}>{body}</p>
									<div className={styles.containerLikeComment}>
										<BoxLikeComment count={commentCount} type='comment'>
											<MdComment className={styles.commentIcon} />
										</BoxLikeComment>
										<BoxLikeComment count={likeCount} type='likes'>
											<LikeButtons screamId={screamId} />
										</BoxLikeComment>
									</div>
								</div>
							</div>

							<div className={styles.commentBox}>
								{comments &&
									comments.map(comment => (
										<Comment comment={comment} key={comment.createdAt} />
									))}
							</div>

							{authenticated && (
								<Form formComment onSubmit={handleSubmit(handleOnSubmit)}>
									<Field
										name='comment'
										label='comment'
										smallField
										error={errors.comment}
										ref={register({ required: "Required" })}
									/>
									<Button disabled={loadingComment}>comment</Button>
								</Form>
							)}
						</>
					) : (
						<ScreamSkeleton />
					)}
				</div>
			</Modal>
		</>
	);
};

export default ScreamDialog;
