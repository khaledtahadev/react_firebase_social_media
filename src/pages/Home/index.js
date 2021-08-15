import { useEffect } from "react";
import styles from "./home.module.css";
import { Scream } from "../../components";
import { ScreamSkeleton } from "../../util/Skeleton";
// types
import { OPEN_DISPATCH } from "../../redux/types";
// Redux
import { useDispatch, useSelector } from "react-redux";
import {
	allScreams,
	allScreamsPagination,
} from "../../redux/actions/dataActions";

const Home = () => {
	const dispatch = useDispatch();
	const { screams, loading } = useSelector(state => state.data);
	const { loading: loadingUi } = useSelector(state => state.ui);
	const { stopDispatch } = useSelector(state => state.ui);

	const onScrollLoaded = e => {
		if (!stopDispatch) {
			const element = e.target;
			const entireHeightContainer = element.scrollHeight;
			const triggerHeight = Math.round(
				element.offsetHeight + element.scrollTop
			);
			if (triggerHeight === entireHeightContainer) {
				const latestDoc = screams[screams.length - 1].createdAt;
				dispatch(allScreamsPagination(latestDoc));
			}
		}
	};

	useEffect(() => {
		dispatch({ type: OPEN_DISPATCH }); // for pagination action
		dispatch(allScreams());
	}, []);

	return (
		<div className={styles.home}>
			<div className='container'>
				{!loading ? (
					typeof screams === "object" && screams !== null ? (
						<div className='containerScroll' onScroll={onScrollLoaded}>
							{screams.map(scream => (
								<Scream scream={scream} key={scream.screamId} />
							))}
						</div>
					) : (
						<p>Sorry No Screams!!!</p>
					)
				) : (
					<ScreamSkeleton />
				)}
				{loadingUi && <p className={styles.loadingScreams}>loading...</p>}
			</div>
		</div>
	);
};

export default Home;
