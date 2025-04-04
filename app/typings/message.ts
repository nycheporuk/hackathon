interface BaseMessage {
  chat_id: string;
  type: string;
}

interface AgentMessage extends BaseMessage {
  message_id: string;
  message: string;
  step_type: 'PlanningStep' | 'ActionStep' | 'FinalAnswerStep' | 'user_message';
  type: 'client' | 'agent_step' | 'message_end';
}

interface HistoryMessage extends BaseMessage {
  chat_id: string;
  type: 'chat_history';
  history: AgentMessage[];
}

type SocketMessage = AgentMessage | HistoryMessage;

interface ChatMessage {
  id: string;
  hiddenMessage: string;
  message: string;
  type: 'client' | 'server';
  isFinished: boolean;
}
