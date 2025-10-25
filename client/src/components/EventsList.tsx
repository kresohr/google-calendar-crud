import { Box, Heading, VStack, Text } from "@chakra-ui/react";
import type { Event, DateFilter } from "../types";
import { EventItem } from "./EventItem";
import {
  groupEventsByDay,
  groupEventsByWeek,
  formatDate,
  sortGroupKeys,
} from "../utils/dateHelpers";

type EventsListProps = {
  events: Event[];
  filter: DateFilter;
};

export const EventsList = ({ events, filter }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.500">No events found for the selected period</Text>
      </Box>
    );
  }

  const groupedEvents =
    filter === 30 ? groupEventsByWeek(events) : groupEventsByDay(events);
  const sortedKeys = sortGroupKeys(groupedEvents);

  return (
    <VStack gap={6}>
      {sortedKeys.map((dateKey) => (
        <Box key={dateKey} w="100%">
          <Heading size="md" mb={3} color="blackAlpha.800">
            {filter === 30
              ? dateKey
              : formatDate(groupedEvents[dateKey][0].startTime)}
          </Heading>
          <VStack gap={3} color="blackAlpha.700">
            {groupedEvents[dateKey].map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};
