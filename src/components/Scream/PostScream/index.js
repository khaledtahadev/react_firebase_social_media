import { useEffect, useRef, useState } from "react";
import { Button, Field, Form, Modal } from "../.."; /* Modal Post New Scream */
import { useForm } from "react-hook-form";
// icons
import { MdAdd } from "react-icons/md";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { postScream } from "../../../redux/actions/dataActions";
// styles
import styles from "./PostScream.module.css";

const PostScream = () => {
	const { register, handleSubmit, formState } = useForm();
	const { errors } = formState;
	const refModal = useRef();
	const [showModal, setShowModal] = useState(false);
	const dispatch = useDispatch();
	const loading = useSelector(state => state.ui.loading);

	const handleOnSubmit = data => {
		dispatch(postScream(data.post));
	};

	const handleClickOutContentModal = e => {
		if (refModal.current === e.target) {
			setShowModal(false);
		}
	};

	useEffect(() => {
		if (!loading && showModal) {
			setShowModal(false);
		}
	}, [loading]);

	return (
		<>
			<MdAdd className={styles.addIcon} onClick={() => setShowModal(true)} />
			<Modal
				showModal={showModal}
				onClick={handleClickOutContentModal}
				ref={refModal}
			>
				<Form onSubmit={handleSubmit(handleOnSubmit)}>
					<Field
						name='post'
						label='Post New Scream'
						ref={register({ required: "Can't be Empty" })}
						textarea
						error={errors.post}
					/>
					<Button largeButton disabled={loading}>
						Post
					</Button>
				</Form>
			</Modal>
		</>
	);
};

export default PostScream;
