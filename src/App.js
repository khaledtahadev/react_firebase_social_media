import { useEffect } from "react";
import { Navbar } from "./components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Login, Signup, UserProfile, User } from "./pages";
import AuthRoute from "./util/AuthRoute";
import { auth } from "./util/firebase";
// Redux
import { useDispatch } from "react-redux";
import { getUserData } from "./redux/actions/userActions";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				dispatch(getUserData());
			}
		});
	});

	return (
		<Router>
			<Navbar />
			<Switch>
				<Route exact path='/' component={Home} />
				<AuthRoute exact path='/login' component={Login} />
				<AuthRoute exact path='/signup' component={Signup} />
				<Route exact path='/userprofile' component={UserProfile} />
				<Route exact path='/users/:userHandle' component={User} />
				<Route
					exact
					path='/users/:userHandle/scream/:screamId'
					component={User}
				/>
			</Switch>
		</Router>
	);
}

export default App;
