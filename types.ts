
export enum Language {
  English = 'English',
  Hindi = 'Hindi',
}

export enum LearningMode {
  Alphabets = 'Learn Alphabets',
  Phrases = 'Learn Common Phrases',
  Conversation = 'Practice Conversation',
}

export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
}
