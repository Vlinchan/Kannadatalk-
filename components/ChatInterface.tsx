import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { SendIcon } from './icons/SendIcon';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  onPlayAudio: (text: string) => Promise<void>;
  isLoading: boolean;
  hasMoreMessages: boolean;
  onLoadMore: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, onPlayAudio, isLoading, hasMoreMessages, onLoadMore }) => {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);

  useEffect(() => {
    // Only scroll to bottom for new messages, not when loading older ones
    if (prevScrollHeightRef.current === null) {
      chatEndRef.current?.scrollIntoView();
    }
  }, [messages]);

  const handleLoadMore = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Store the current scroll height before new messages are added
      prevScrollHeightRef.current = container.scrollHeight;
      onLoadMore();
    }
  };

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    // After new messages are rendered at the top, adjust scroll position
    if (container && prevScrollHeightRef.current !== null) {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop += newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null; // Reset after adjusting
    }
  }, [messages]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent min-h-0">
      <div ref={scrollContainerRef} className="flex-grow p-6 overflow-y-auto flex flex-col">
        <div className="flex-grow" /> {/* Spacer to push content to the bottom */}
        <div className="space-y-6"> {/* Wrapper for messages */}
            {hasMoreMessages && (
                <div className="text-center">
                    <button 
                        onClick={handleLoadMore}
                        className="bg-amber-200 text-stone-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-300 transition-colors"
                    >
                        Load older messages
                    </button>
                </div>
            )}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onPlayAudio={onPlayAudio} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-stone-800 self-start px-4 py-3 rounded-2xl shadow-md" style={{ borderRadius: '1.25rem 1.25rem 1.25rem 0.25rem' }}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-amber-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
        </div>
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-amber-100/80 border-t border-amber-200/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-full border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-shadow duration-200 bg-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-maroon-800 text-white p-3 rounded-full hover:bg-maroon-900 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
