import { Box, Heading, Text, HStack } from "@chakra-ui/react";
import type { Event } from "../types";
import { formatDate, formatTime } from "../utils/dateHelpers";

type EventItemProps = {
  event: Event;
};

export const EventItem = ({ event }: EventItemProps) => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      _hover={{ shadow: "md", borderColor: "teal.300" }}
      transition="all 0.2s"
      w="100%"
    >
      <Heading size="sm" mb="1rem">
        {event.title}
      </Heading>
      <HStack color="gray.600" fontSize="sm" justify="center">
        <Text>{formatTime(event.startTime)}</Text>
        <Text>-</Text>
        <Text>{formatTime(event.endTime)}</Text>
      </HStack>
      <Text fontSize="sm">{formatDate(event.startTime)}</Text>
      {event.description && (
        <Text mt={2} fontSize="sm" color="gray.600">
          {event.description}
        </Text>
      )}
    </Box>
  );
};
