import { useState } from "react";
import toast from "react-hot-toast";
import { Image, X } from "lucide-react";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { RxAvatar } from "react-icons/rx";
import { Loader } from "lucide-react";
const PostCreation = () => {
	const dispatch = useDispatch();
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then((result) => setImagePreview(result));
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleUpload = async () => {
		try {
			if (!image) {
				toast.error("Please select an image to upload.");
				return;
			}
			setLoading(true);
			const imageData = await readFileAsDataURL(image);

			const res = await axios.post(
				`${BASE_URL}/profile/avatar`,
				{ image: imageData },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			dispatch(addUser(res?.data?.data));
			toast.success("Image uploaded successfully.");
			setIsModalOpen(false);
			setImage(null);
			setImagePreview(null);
			setLoading(false);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to upload image.");
		}
	};

	return (
		<>
			<button
				className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-colors m-12"
				onClick={() => setIsModalOpen(true)}>
				<RxAvatar size={24} />
			</button>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-base-300 rounded-lg p-6 w-96">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Upload Image</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-gray-500 hover:text-gray-800">
								<X size={20} />
							</button>
						</div>

						{imagePreview && (
							<img
								src={imagePreview}
								alt="Preview"
								className="w-full h-auto rounded-lg mb-4"
							/>
						)}

						<div className="flex items-center space-x-4">
							<label
								htmlFor="fileInput"
								className="btn btn-outline btn-primary hover:bg-primary hover:text-white hover:shadow-lg transition-all">
								Select Image
							</label>
							<input
								type="file"
								accept="image/*"
								id="fileInput"
								className="hidden"
								onChange={handleImageChange}
							/>
							<button
								className="btn btn-outline btn-secondary hover:bg-secondary hover:text-white hover:shadow-lg transition-all"
								onClick={handleUpload}>
								{loading ? <Loader className="animate-spin" /> : "Upload"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default PostCreation;
