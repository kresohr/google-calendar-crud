import type { Event, CreateEventData } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const eventsAPI = {
  getEvents: async (): Promise<Event[]> => {
    return fetchAPI("/api/events");
  },

  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    return fetchAPI("/api/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  syncEvents: async (): Promise<{ success: boolean; syncedCount: number }> => {
    return fetchAPI("/api/events/sync", { method: "POST" });
  },
};
