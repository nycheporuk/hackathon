import { useState } from 'react';
import Markdown from 'react-markdown';
import selectIcon from '~/assets/svg/Select-up.svg';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isUser = message.type === 'client';
  return (
    <div className={`message ${isUser ? 'user-bubble' : 'server-bubble'}`}>
      {/* {message.message} */}
      <Markdown>{message.message}</Markdown>
      {!message.isFinished && (
        <div className="dot-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {message.hiddenMessage && (
        <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide all thoughts' : 'Show all thoughts'}
          <img className={isExpanded ? '' : 'rotate'} src={selectIcon} />
        </button>
      )}
      {isExpanded && (
        <div className="hidden-bubble">
          {/* {message.hiddenMessage} */}
          <Markdown>{message.hiddenMessage}</Markdown>
        </div>
      )}
    </div>
  );
}
