import { useEffect, useState, useRef } from "react";
// components
import { Modal, Button, Field, Form } from "../../components";
// icons
import { MdCreate } from "react-icons/md";
// Styles
import styles from "./EditeModal.module.css";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../redux/actions/userActions";

const EditeModal = () => {
	const [showModal, setShowModal] = useState(false);
	const refModal = useRef();
	const [detailsUser, setDetailsUser] = useState({
		bio: "",
		location: "",
		websiteUrl: "",
	});
	const dispatch = useDispatch();
	const loading = useSelector(state => state.ui.loading);

	const handleClickOutContentModal = e => {
		if (refModal.current === e.target) {
			setShowModal(false);
		}
	};

	useEffect(() => {
		if (!loading && showModal) {
			setShowModal(false);
			setDetailsUser({
				bio: "",
				location: "",
				websiteUrl: "",
			});
		}
	}, [loading]);

	const handleCancelModal = e => {
		e.preventDefault();
		setShowModal(false);
		setDetailsUser({
			bio: "",
			location: "",
			websiteUrl: "",
		});
	};

	const handleAddUserDetails = e => {
		e.preventDefault();
		dispatch(updateUserDetails(detailsUser));
	};

	return (
		<>
			<MdCreate
				className={styles.editIcon}
				onClick={() => setShowModal(true)}
			/>

			<Modal
				showModal={showModal}
				onClick={handleClickOutContentModal}
				ref={refModal}
			>
				<Form onSubmit={handleAddUserDetails} id='formDetails'>
					<Field
						label='bio'
						textarea
						value={detailsUser.bio}
						onChange={e =>
							setDetailsUser({ ...detailsUser, bio: e.target.value })
						}
					/>
					<Field
						label='location'
						value={detailsUser.location}
						onChange={e =>
							setDetailsUser({ ...detailsUser, location: e.target.value })
						}
					/>
					<Field
						label='website url'
						value={detailsUser.websiteUrl}
						onChange={e =>
							setDetailsUser({ ...detailsUser, websiteUrl: e.target.value })
						}
					/>
					<div>
						<Button largeButton disabled={loading}>
							Save
						</Button>
						<Button largeButton onClick={handleCancelModal} disabled={loading}>
							Cancel
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default EditeModal;
