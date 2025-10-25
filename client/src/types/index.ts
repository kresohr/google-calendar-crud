export interface Event {
  id: string;
  googleId: string;
  userId: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export type DateFilter = 1 | 7 | 30;
