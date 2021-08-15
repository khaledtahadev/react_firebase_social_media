// icons
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { likeScream, unLikeScream } from "../../../redux/actions/dataActions";
// styles
import styles from "./likeButtons.module.css";

// main
const LikeButtons = ({ screamId }) => {
	const dispatch = useDispatch();
	const { likes, authenticated } = useSelector(state => state.user);

	const handleLikedThisScreamOrNo = () => {
		return likes && likes.filter(like => like.screamId === screamId).length > 0;
	};

	const handleLikeScrem = screamId => {
		dispatch(likeScream(screamId));
	};

	const handleUnLikeScream = screamId => {
		dispatch(unLikeScream(screamId));
	};

	return (
		<>
			{authenticated ? (
				handleLikedThisScreamOrNo() ? (
					<MdFavorite
						className={styles.likeIcon}
						onClick={() => handleUnLikeScream(screamId)}
					/>
				) : (
					<MdFavoriteBorder
						className={styles.likeIcon}
						onClick={() => handleLikeScrem(screamId)}
					/>
				)
			) : (
				<Link to='/login'>
					<MdFavoriteBorder className={styles.likeIcon} />
				</Link>
			)}
		</>
	);
};

export default LikeButtons;
