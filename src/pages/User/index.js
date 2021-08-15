import { useEffect } from "react";
import StaticProfile from "../UserProfile/StaticProfile";
import { ScreamSkeleton } from "../../util/Skeleton";
// styles
import styles from "./user.module.css";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { specificUserData } from "../../redux/actions/dataActions";
import { Scream } from "../../components";

const User = ({ match }) => {
	const dispatch = useDispatch();
	const { screams, loading } = useSelector(state => state.data);
	const { userHandle, screamId } = match.params;

	useEffect(() => {
		dispatch(specificUserData(userHandle));
	}, [userHandle]);

	return (
		<div className={styles.users}>
			<div className='container'>
				<StaticProfile userHandle={userHandle} />

				{!loading ? (
					typeof screams === "object" && screams !== null ? (
						<div className='containerScroll'>
							{screams.map(scream =>
								scream.screamId === screamId ? (
									<Scream scream={scream} key={scream.screamId} openDailog />
								) : (
									<Scream scream={scream} key={scream.screamId} />
								)
							)}
						</div>
					) : (
						<p className={styles.noScreams}>No Screams for this user</p>
					)
				) : (
					<ScreamSkeleton />
				)}
			</div>
		</div>
	);
};

export default User;
// 1LaTIRMnDJYHeJCPm2dK
