import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../../store/useChatStore.js'
import ChatHeader from './ChatHeader.js';
import MessageInput from "./MessageInput.js";
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from "../../../store/authStore.js";
import { formatMessageTime } from '../../../utils/utils.js';

function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { user } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id)
  }, [selectedUser._id, getMessages])

  useEffect(() => {
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col bg-gray-900">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-gray-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-600">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === user._id;
          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div className={`flex max-w-md ${isOwnMessage ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-800 shadow-lg">
                    <img
                      src={
                        isOwnMessage
                          ? user.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl shadow-md ${
                    isOwnMessage 
                      ? "bg-indigo-600 text-gray-100 rounded-br-none" 
                      : "bg-gray-800 text-gray-100 rounded-bl-none"
                  }`}>
                    {message.image && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="w-full max-w-xs object-cover"
                        />
                      </div>
                    )}
                    {message.text && <p className="leading-relaxed">{message.text}</p>}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer