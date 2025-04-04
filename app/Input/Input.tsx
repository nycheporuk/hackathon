import { useState, type KeyboardEvent } from 'react';
import sendIcon from '~/assets/svg/send.svg';
import TextareaAutosize from 'react-textarea-autosize';

interface InputProps {
  disabled: boolean;
  handleSendMessage: (message: string) => string;
}

export default function Input({ disabled, handleSendMessage }: InputProps) {
  const [inputValue, setInputValue] = useState<string>('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // щоб не переходив на новий рядок
      if (!disabled && inputValue.trim() !== '') {
        setInputValue(handleSendMessage(inputValue));
      }
    }
  };

  return (
    <div className="input-container">
      <TextareaAutosize
        minRows={1}
        maxRows={10}
        className="textarea"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="button"
        disabled={disabled}
        onClick={() => setInputValue(handleSendMessage(inputValue))}
      >
        <img src={sendIcon} />
      </button>
    </div>
  );
}
