import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { SpeakerIcon } from './icons/SpeakerIcon';

interface MessageBubbleProps {
  message: Message;
  onPlayAudio: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message, onPlayAudio }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const isUser = message.sender === Sender.User;

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    await onPlayAudio(message.text);
    setIsPlaying(false);
  };

  const bubbleClasses = isUser
    ? 'bg-amber-200 text-stone-800 self-end'
    : 'bg-white text-stone-800 self-start';
  
  const formattedText = message.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md md:max-w-lg lg:max-w-2xl flex items-start gap-2.5`}>
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}
          style={{
            borderRadius: isUser ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
          }}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{formattedText}</p>
          {!isUser && (
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className={`absolute -bottom-3 -right-3 p-2 rounded-full transition-colors duration-200 ${
                isPlaying
                  ? 'bg-amber-600 text-white cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
              aria-label="Play audio for this message"
            >
              <SpeakerIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
