import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthRoute = ({ component: Component, ...res }) => {
	const authenticated = useSelector(state => state.user.authenticated);

	return (
		<Route
			{...res}
			render={props =>
				authenticated === true ? <Redirect to='/' /> : <Component {...props} />
			}
		/>
	);
};
export default AuthRoute;
