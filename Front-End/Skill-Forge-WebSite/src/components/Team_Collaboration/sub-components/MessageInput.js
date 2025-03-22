import React, { useRef, useState } from 'react'
import { useChatStore } from '../../../store/useChatStore.js'
import { Image, Send, X } from "lucide-react";
import toast from 'react-hot-toast';

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    // gets the first one
    const file = e.target.files[0];
    
    //if the selected file is not a image, this function is used 
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // if the user selected a image file, shows a preview of that said image file
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async(e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-gray-900 border-t border-gray-800">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-700 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 
              flex items-center justify-center shadow-lg"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent placeholder-gray-500"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center transition-colors duration-200
                     ${imagePreview ? "text-indigo-400 bg-gray-800" : "text-gray-400 bg-gray-800 hover:bg-gray-700"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} />
          </button>
        </div>
        <button
          type="submit"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200
                   ${(!text.trim() && !imagePreview) 
                     ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                     : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput