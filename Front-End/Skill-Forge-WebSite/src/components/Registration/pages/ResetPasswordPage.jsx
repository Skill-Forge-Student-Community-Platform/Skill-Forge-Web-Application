import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../shared/input";
import { Lock, Loader, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(""); // Clear previous errors

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			toast.error("Passwords do not match");
			return;
		}

		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			const errorMsg = error.message || "Error resetting password. Please try again.";
			setErrorMessage(errorMsg);
			toast.error(errorMsg);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Reset Password
				</h2>

				{errorMessage && (
					<div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md flex items-start">
						<AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
						<p className="text-red-400 text-sm">{errorMessage}</p>
					</div>
				)}

				{message && (
					<div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-md">
						<p className="text-green-400 text-sm">{message}</p>
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<Input
						icon={Lock}
						type='password'
						placeholder='New Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm New Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Set New Password"}
					</motion.button>
				</form>
			</div>
		</motion.div>
	);
};

export default ResetPasswordPage;
