import { Link } from "react-router-dom";
import noImg from "../../../images/user.png";
// component
import { Button } from "../..";
import { PostScream } from "../..";
import { Notifications } from "../..";
// Redux
import { useSelector } from "react-redux";
// Styles
import styles from "./navbar.module.css";

const Navbar = () => {
	const {
		authenticated,
		credentials: { avatarURL },
	} = useSelector(state => state.user);

	return (
		<nav className={styles.navbar}>
			<div className='container'>
				<div className={styles.content}>
					<h1>
						<Link to='/' className={styles.logo}>
							Social App
						</Link>
					</h1>
					{authenticated && <Notifications />}
					<div className={styles.linksButton}>
						{authenticated && <PostScream />}
						{!authenticated && (
							<>
								<Link to='/login'>
									<Button>Login</Button>
								</Link>
								<Link to='/signup'>
									<Button>signup</Button>
								</Link>
							</>
						)}
					</div>
					{authenticated && (
						<Link to='/userprofile'>
							<img
								src={!authenticated ? noImg : avatarURL}
								className={styles.imgUser}
								alt='imgalt'
								width='50'
								height='50'
							/>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
