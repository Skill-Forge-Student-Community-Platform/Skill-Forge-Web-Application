import { motion } from "framer-motion";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
	return (
		<div className='min-h-screen bg-transparent flex flex-col items-center justify-center relative overflow-hidden gap-6 loading-spinner-wrapper'>
			<div className="sf-search-loader">
				<div className="sf-search-loader-container">
					<div className="sf-bars-container">
						<motion.span
							className="sf-progress-bar"
							initial={{ backgroundPosition: "0% 0%" }}
							animate={{ backgroundPosition: "100% 0%" }}
							transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
						></motion.span>
						<motion.span
							className="sf-progress-bar sf-short-bar"
							initial={{ backgroundPosition: "0% 0%" }}
							animate={{ backgroundPosition: "100% 0%" }}
							transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
						></motion.span>
					</div>

					<motion.svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 100 100"
						className="sf-search-icon"
						initial={{ x: -20, rotate: 65 }}
						animate={{ x: 75, rotate: 15 }}
						transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
					>
						<circle strokeWidth="7" stroke="#2563EB" cx="45" cy="45" r="25"></circle>
						<line strokeWidth="7" stroke="#2563EB" x1="65" y1="65" x2="90" y2="90"></line>
					</motion.svg>
				</div>
				<div className="sf-loading-text">Searching for knowledge...</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
