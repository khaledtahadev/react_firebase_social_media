import { Button, Field, Form } from "../../components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/actions/userActions";
// Styles
import styles from "./signup.module.css";
import { useEffect } from "react";

const Signup = ({ history }) => {
	const { register, handleSubmit, formState, setError } = useForm();
	const { errors } = formState;
	const { error, loading } = useSelector(state => state.ui);
	const dispatch = useDispatch();

	const handleOnSubmit = async data => {
		dispatch(signup(data, history));
	};

	useEffect(() => {
		dispatch({ type: "CLEAR_ERROR" });
	}, []);

	return (
		<div className={styles.signup}>
			<div className='container'>
				<h2 className={styles.headerTitle}>Sign up</h2>
				<Form onSubmit={handleSubmit(handleOnSubmit)}>
					<Field
						name='handle'
						label='username'
						ref={register({ required: "Required" })}
						error={errors.handle?.message || error?.handle}
					/>
					<Field
						name='email'
						type='email'
						label='email'
						ref={register({ required: "Required" })}
						error={errors.email?.message || error?.email}
					/>
					<Field
						name='password'
						type='password'
						label='password'
						ref={register({
							required: "Required",
							minLength: { value: 6, message: "minimum is 6 " },
						})}
						error={errors.password?.message}
					/>
					<Field
						name='confirmPassword'
						type='password'
						label='confirm password'
						ref={register({ required: "Required" })}
						error={errors.confirmPassword?.message}
					/>
					{error?.general && (
						<p className={styles.generalError}>{error.general}</p>
					)}
					<Button largeButton disabled={loading}>
						Signup
					</Button>
					<p className={styles.haveAcount}>
						have an account?{" "}
						<Link to='/login' disabled={loading}>
							login
						</Link>
					</p>
				</Form>
			</div>
		</div>
	);
};

export default Signup;
