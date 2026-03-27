export type CoachSessionType = 'coaching' | 'reflection' | 'check_in' | 'crisis_redirect';
export type CoachRole = 'user' | 'assistant' | 'system';

export type CoachMessage = {
  id: string;
  role: CoachRole;
  content: string;
  createdAt: string;
};

export type CoachStreamEvent =
  | { type: 'delta'; delta: string }
  | { type: 'end'; sessionId: string; summary?: string }
  | { type: 'error'; message: string };
