import React from 'react'
import { useChatStore } from '../../../store/useChatStore.js'
import Sidebar from './Sidebar.js';
import NoChatSelected from './NoChatSelected.js';
import ChatContainer from './ChatContainer.js';

export const Inbox = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex items-center justify-center h-full px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
