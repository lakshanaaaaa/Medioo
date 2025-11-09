import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
	const {
		_id,
		firstName,
		lastName,
		photoUrl,
		age,
		gender,
		about,
		skills,
		badges,
	} = user;
	const dispatch = useDispatch();

	const handleSendRequest = async (status, userId) => {
		try {
			const res = await axios.post(
				BASE_URL + "/request/send/" + status + "/" + userId,
				{},
				{ withCredentials: true }
			);
			dispatch(removeUserFromFeed(userId));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="card bg-base-300 w-96 shadow-2xl rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 h-[500px]">
			<figure className="relative w-full">
				<div className="w-full h-64 overflow-hidden rounded-t-lg">
					{photoUrl ? (
						<img
							src={photoUrl}
							alt="photo"
							className="w-full h-full object-cover"
						/>
					) : (
						<RxAvatar size={250} className="mx-auto my-4 text-primary" />
					)}
				</div>
			</figure>
			<div className="card-body text-white">
				<h2 className="card-title text-2xl font-bold text-primary">
					{firstName + " " + lastName}
				</h2>

				{age && gender && (
					<p className="text-sm text-neutral-content">
						{"Age: " + age + ", " + "Gender: " + gender}
					</p>
				)}
				<p className="text-sm text-neutral-content mt-2">About: {about}</p>

				<div className="card-actions justify-center my-4 space-x-4">
					<button
						className="btn btn-outline btn-secondary hover:bg-secondary hover:text-white hover:shadow-lg transition-all"
						onClick={() => handleSendRequest("ignored", _id)}>
						Ignore
					</button>
					<button
						className="btn btn-outline btn-primary hover:bg-primary hover:text-white hover:shadow-lg transition-all"
						onClick={() => handleSendRequest("interested", _id)}>
						Interested
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserCard;
