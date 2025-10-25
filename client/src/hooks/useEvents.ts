import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsAPI } from "../services/api";
import type { CreateEventData, DateFilter } from "../types";
import { filterEventsByDays } from "../utils/dateHelpers";

export const useEvents = (filter: DateFilter) => {
  return useQuery({
    queryKey: ["events", filter],
    queryFn: eventsAPI.getEvents,
    select: (data) => filterEventsByDays(data, filter),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: CreateEventData) =>
      eventsAPI.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Failed to create event:", error);
    },
  });
};

export const useSyncEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventsAPI.syncEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      console.error("Failed to sync event:", error);
    },
  });
};
