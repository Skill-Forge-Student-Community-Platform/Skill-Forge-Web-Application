// ShareModal.js
import { IoClose } from "react-icons/io5";

const ShareModal = ({ showModal, setShowModal, pageUrl, handleCopy }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    showModal && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white p-4 rounded-lg shadow-lg w-96">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Share Link</h2>
            <button onClick={() => setShowModal(false)}>
              <IoClose className="text-xl" />
            </button>
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={pageUrl}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleCopy}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ShareModal;
