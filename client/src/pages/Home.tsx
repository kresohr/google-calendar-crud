import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEvents, useSyncEvents } from "../hooks/useEvents";
import { EventsList } from "../components/EventsList";
import { AddEventForm } from "../components/AddEventForm";
import { FilterControls } from "../components/FilterControls";
import { toaster } from "../components/ui/toaster";
import type { DateFilter } from "../types";

export const Home = () => {
  const [filter, setFilter] = useState<DateFilter>(7);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: events = [], isLoading, error } = useEvents(filter);
  const syncEvents = useSyncEvents();

  const handleSync = async () => {
    try {
      const result = await syncEvents.mutateAsync();
      toaster.create({
        title: "Sync successful",
        description: `Synced ${result.syncedCount} events from Google Calendar`,
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: "Sync failed",
        description: (error as Error).message,
        type: "error",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <VStack gap={4}>
            <Spinner size="xl" color="teal.500" />
            <Text color="gray.700">Loading events...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="4xl">
          <Box
            bg="red.50"
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text color="red.600">Error loading events: {error.message}</Text>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="4xl" py={8}>
        <VStack gap={6} align="stretch">
          <Box>
            <Heading size="xl" mb={2} color="blackAlpha.800">
              My Calendar Events
            </Heading>
            <Text color="gray.600">Manage your Google Calendar events</Text>
          </Box>

          {!showAddForm && (
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <FilterControls onFilterChange={setFilter} />

              <HStack gap={2}>
                <Button
                  backgroundColor="blackAlpha.800"
                  _hover={{
                    backgroundColor: "blackAlpha.700",
                    borderColor: "transparent",
                  }}
                  _focusVisible={{ outline: "none" }}
                  _focus={{ outline: "none" }}
                  transition="all 0.2s"
                  onClick={handleSync}
                  loading={syncEvents.isPending}
                  size="sm"
                >
                  Sync from Google
                </Button>
              </HStack>
            </HStack>
          )}

          <Button
            backgroundColor="blackAlpha.800"
            _hover={{
              backgroundColor: "blackAlpha.700",
              borderColor: "transparent",
            }}
            _focusVisible={{ outline: "none" }}
            _focus={{ outline: "none" }}
            transition="all 0.2s"
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
          >
            {showAddForm ? "Hide Form" : "Add Event"}
          </Button>

          {showAddForm && <AddEventForm />}

          {!showAddForm && (
            <Box>
              <EventsList events={events} filter={filter} />
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};
