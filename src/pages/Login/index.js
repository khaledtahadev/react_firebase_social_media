import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Field, Form } from "../../components";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../redux/actions/userActions";
// styles
import styles from "./login.module.css";

const Login = ({ history }) => {
	const { register, handleSubmit, formState, setError } = useForm();
	const { errors } = formState;
	const { error, loading } = useSelector(state => state.ui);
	const dispatch = useDispatch();

	const handleSubmitLogin = data => {
		dispatch(login(data, history));
	};

	useEffect(() => {
		dispatch({ type: "CLEAR_ERROR" });
	}, []);

	return (
		<div className={styles.login}>
			<div className='container'>
				<h2 className={styles.headerTitle}>Login</h2>
				<Form onSubmit={handleSubmit(handleSubmitLogin)}>
					<Field
						name='email'
						type='email'
						label='Email'
						ref={register({ required: "Required" })}
						error={errors.email?.message || error?.email}
					/>
					<Field
						name='password'
						type='password'
						label='password'
						ref={register({
							required: "Required",
							minLength: { value: 6, message: "minimum is 6" },
						})}
						error={errors.password?.message || error?.password}
					/>
					{error?.general && (
						<p className={styles.generalError}>{error.general}</p>
					)}
					<Button largeButton disabled={loading}>
						Login
					</Button>
					<p className={styles.textNotAcount}>
						not have acount?{" "}
						<Link to='/signup' disabled={loading}>
							Create an acount
						</Link>
					</p>
				</Form>
			</div>
		</div>
	);
};

export default Login;
