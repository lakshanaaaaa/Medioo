import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Loader } from "lucide-react";
const Connections = () => {
	const connections = useSelector((store) => store.connections);
	const dispatch = useDispatch();
	const [violationReport, setViolationReport] = useState([]);
	const [violationModal, setviolationModal] = useState(false);
	const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
	const [loading, setloading] = useState(false);
	const [userModalIsOpen, setUserModalIsOpen] = useState(false);
	const [reportData, setReportData] = useState({
		reportedUser: "",
		description: "",
		violationType: "cheating",
	});
	const [toastIsVisible, setToastIsVisible] = useState(false);
	const [userData, setUserData] = useState(null);

	const fetchConnections = async () => {
		try {
			const res = await axios.get(BASE_URL + "/user/connections", {
				withCredentials: true,
			});
			dispatch(addConnection(res.data.data));
		} catch (err) {
			console.error("Error fetching connections:", err);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setReportData({ ...reportData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				BASE_URL + "/report/reportUser",
				reportData,
				{
					withCredentials: true,
				}
			);

			setReportModalIsOpen(false);
			setToastIsVisible(true);
			setTimeout(() => setToastIsVisible(false), 3000);
		} catch (err) {
			console.error("Error submitting report:", err);
		}
	};

	const openReportModal = (userId) => {
		setReportData({ ...reportData, reportedUser: userId });
		setReportModalIsOpen(true);
	};

	const openUserDataModal = (userId) => {
		const selectedUser = connections.find((user) => user._id === userId);
		setUserData(selectedUser);
		setUserModalIsOpen(true);
	};

	const closeModal = () => {
		setReportModalIsOpen(false);
		setUserModalIsOpen(false);
		setUserData(null);
	};

	const ViolationReports = async (id) => {
		setloading(true);
		setviolationModal(true);
		try {
			const res = await axios.get(BASE_URL + `/report/reportData/${id}`, {
				withCredentials: true,
			});
			setViolationReport(res.data.data);
		} catch (err) {
			console.error("Error fetching violation reports:", err);
		} finally {
			setloading(false);
		}
	};

	useEffect(() => {
		fetchConnections();
	}, []);

	if (!connections) return null;

	if (connections.length === 0)
		return (
			<h1 className="text-3xl font-bold text-center mt-40 text-white mb-6">
				No Connections Found
			</h1>
		);
	return (
		<div className="text-center my-10">
			<h1 className="text-3xl font-bold text-white mb-6">Connections</h1>
			{connections.map((connection) => {
				const { _id, firstName, lastName, photoUrl, age, gender, about } =
					connection;
				return (
					<div
						key={_id}
						className="flex items-center p-6 m-4 rounded-lg shadow-lg bg-neutral-focus border border-neutral-content hover:bg-neutral hover:shadow-xl transition-all max-w-3xl mx-auto">
						<div>
							<img
								alt="User Avatar"
								className="w-20 h-20 rounded-full object-cover"
								src={photoUrl}
							/>
						</div>
						<div className="text-left mx-6">
							<h2 className="text-xl font-semibold text-white">
								{firstName} {lastName}
							</h2>
							{age && gender && (
								<p className="text-sm text-neutral-content">
									{age}, {gender}
								</p>
							)}
							<p className="text-neutral-content text-sm">{about}</p>

							<button
								onClick={() => openUserDataModal(_id)}
								className="btn btn-outline btn-sm btn-primary mt-4 px-4 py-2">
								View User Data
							</button>

							<button
								onClick={() => openReportModal(_id)}
								className="btn btn-outline btn-sm btn-error mt-4 ml-4 px-4 py-2">
								Report
							</button>
							<button
								onClick={() => ViolationReports(_id)}
								className="btn btn-outline btn-sm btn-error mt-4 ml-4 px-4 py-2">
								Violation Reports
							</button>
						</div>
					</div>
				);
			})}
			<div
				className={`modal ${userModalIsOpen ? "modal-open" : ""}`}
				onClick={closeModal}>
				<div
					className="modal-box"
					onClick={(e) => e.stopPropagation()} // Prevent closing modal on form click
				>
					<h2 className="text-xl font-semibold mb-4">User Data</h2>
					{userData && (
						<div>
							{/* Name */}
							<p className="text-lg font-semibold">
								Name:{" "}
								{userData.firstName ? userData.firstName : "Data not provided"}{" "}
								{userData.lastName ? userData.lastName : "Data not provided"}
							</p>

							{/* Age */}
							<p>Age: {userData.age ? userData.age : "Data not provided"}</p>

							{/* Gender */}
							<p>
								Gender:{" "}
								{userData.gender ? userData.gender : "Data not provided"}
							</p>

							{/* About */}
							<p>
								About: {userData.about ? userData.about : "Data not provided"}
							</p>

							{/* Skills */}
							<p>
								Skills:{" "}
								{userData.skills && userData.skills.length > 0
									? userData.skills.join(", ")
									: "Data not provided"}
							</p>

							{/* Photo */}
							<div className="flex justify-center my-4">
								<img
									src={
										userData.photoUrl ? userData.photoUrl : "default-photo-url"
									}
									alt="User Avatar"
									className="w-32 h-32 rounded-full object-cover border-2 border-neutral-400"
								/>
							</div>
						</div>
					)}

					<div className="modal-action">
						<button
							onClick={closeModal}
							className="btn btn-outline btn-sm btn-error">
							Close
						</button>
					</div>
				</div>
			</div>

			<div
				className={`modal ${violationModal ? "modal-open" : ""}`}
				onClick={() => setviolationModal(false)}>
				{loading ? (
					<Loader className="animate-spin" />
				) : (
					<div
						className="modal-box max-h-[80vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}>
						<h2 className="text-xl font-bold mb-4">Violation Reports</h2>
						{violationReport.map((data) => {
							const { description, violationType, updatedAt } = data;
							return (
								<div
									key={data._id}
									className="rounded-lg p-4 mb-4 shadow-md border border-base-300 bg-base-200 text-base-content">
									<p className="font-semibold mb-2">
										<span className="text-sm font-bold">Description:</span>{" "}
										{description}
									</p>
									<p className="mb-2">
										<span className="text-sm font-bold">Report Type:</span>{" "}
										{violationType}
									</p>
									<p className="mb-2">
										<span className="text-sm font-bold">Report Date:</span>{" "}
										{new Date(updatedAt).toLocaleDateString()}
									</p>
								</div>
							);
						})}
						<div className="modal-action">
							<button
								onClick={() => setviolationModal(false)}
								className="btn btn-outline btn-sm btn-error">
								Close
							</button>
						</div>
					</div>
				)}
			</div>
			<div
				className={`modal ${reportModalIsOpen ? "modal-open" : ""}`}
				onClick={closeModal}>
				<div className="modal-box" onClick={(e) => e.stopPropagation()}>
					<h2 className="text-xl font-semibold mb-4">Submit a Report</h2>
					<form onSubmit={handleSubmit}>
						<div>
							<label className="block text-sm mb-2" htmlFor="violationType">
								Violation Type:
							</label>
							<select
								id="violationType"
								name="violationType"
								value={reportData.violationType}
								onChange={handleInputChange}
								className="select select-success select-outline w-full p-2 mt-4 border border-success rounded mb-2">
								<option value="cheating">Cheating</option>
								<option value="abuse">Abuse</option>
								<option value="harassment">Harassment</option>
								<option value="spam">Spam</option>
								<option value="other">Other</option>
							</select>
						</div>

						<div>
							<label className="block text-sm mb-2" htmlFor="description">
								Description:
							</label>
							<textarea
								id="description"
								name="description"
								value={reportData.description}
								onChange={handleInputChange}
								maxLength="500"
								rows="4"
								className="textarea textarea-success textarea-outline w-full p-2 mt-4 border border-success rounded"
							/>
						</div>

						<button
							type="submit"
							className="btn btn-outline btn-sm btn-primary mt-4 px-4 py-2">
							Submit Report
						</button>
					</form>
					<div className="modal-action">
						<button
							onClick={closeModal}
							className="btn btn-outline btn-sm btn-error">
							Close
						</button>
					</div>
				</div>
			</div>
			{toastIsVisible && (
				<div className="toast toast-top toast-center">
					<div className="alert alert-success">
						<div>
							<span>Report Submitted Successfully!</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Connections;
