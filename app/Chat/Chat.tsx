import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { v4 as uuid } from 'uuid'; // or v7, if your environment supports it
import './Chat.scss';
import Input from '~/Input/Input';
import Message from '~/Message/Message';

interface ChatProps {
  id: string; // unique ID to identify this chat instance
}

const Chat: React.FC<ChatProps> = ({ id }) => {
  const [messagesMap, _setMessages] = useState(new Map<string, ChatMessage>());
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Reference to the chat window for automatic scrolling
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   fetch(`https://fef0b1da3c19.ngrok.app/history/${id}`).then((response) => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = response.json();
  //     console.log(data);
  //   });
  // }, []);

  const addMessages = (newMessages: AgentMessage[]) => {
    _setMessages((prev) => {
      const updatedMessages = new Map(prev);
      newMessages.forEach((newMessage) => {
        const { message_id, message, step_type, type } = newMessage;
        const oldMessage = updatedMessages.get(message_id);
        const mappedMessage: ChatMessage = {
          hiddenMessage: oldMessage?.hiddenMessage || '',
          message: oldMessage?.message || '',
          id: message_id,
          type: type === 'client' ? 'client' : 'server',
          isFinished: type === 'client' || type === 'message_end',
        };

        if (message) {
          if (type === 'agent_step') {
            const key = step_type === 'FinalAnswerStep' ? 'message' : 'hiddenMessage';
            mappedMessage[key] += message;
          } else if (type === 'client') {
            mappedMessage.message = message;
          }
        }

        updatedMessages.set(message_id, mappedMessage);
      });
      return updatedMessages;
    });
  };

  useEffect(() => {
    // Create and open the WebSocket
    // const socket = new WebSocket('ws://0.tcp.eu.ngrok.io:13146/chat/' + id);
    const socket = new WebSocket('ws://ec2-54-166-149-217.compute-1.amazonaws.com:8765/chat/' + id);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      socket.send(
        JSON.stringify({
          type: 'get_history',
          chat_id: id,
        })
      );
    };

    socket.onmessage = (event: MessageEvent) => {
      // We assume the server sends data as a JSON string
      const data = JSON.parse(event.data) as SocketMessage;

      // Make sure the chat_id matches this component's ID
      if (data.chat_id !== id) return;

      switch (data.type) {
        case 'chat_history':
          addMessages(data.history);
          setIsHistoryLoaded(true);
          break;
        case 'agent_step':
        case 'message_end':
          addMessages([data]);
          break;
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // Store the socket in component state
    setWs(socket);

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [id]);

  // Scroll to the bottom on new messages
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messagesMap]);

  // Send message to server
  const handleSendMessage = (inputValue: string): string => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return inputValue;
    if (!inputValue.trim()) return inputValue;

    // Construct the new message
    const newMessage: AgentMessage = {
      chat_id: id,
      message_id: uuid(),
      step_type: 'user_message',
      message: inputValue,
      type: 'client',
    };

    // Send JSON over the WebSocket
    ws.send(JSON.stringify(newMessage));

    // Update local messages
    addMessages([newMessage]);
    return '';
  };

  // Stop any generation or activity (dummy example)

  if (!isHistoryLoaded) {
    return null;
  }

  const messages = Array.from(messagesMap.values());
  const hasMessages = messages.length > 0;
  const isGenerating = messages.some((msg) => !msg.isFinished);

  return (
    <div className={`chat-container ${hasMessages ? '' : 'empty'}`}>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg) => {
          return <Message key={msg.id} message={msg} />;
        })}
      </div>

      <Input disabled={isGenerating} handleSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
