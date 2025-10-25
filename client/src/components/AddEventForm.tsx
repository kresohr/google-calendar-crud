import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { toaster } from "./ui/toaster";
import { useCreateEvent } from "../hooks/useEvents";

export const AddEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const createEvent = useCreateEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !startTime || !endTime) {
      toaster.create({
        title: "Missing fields",
        description: "Please fill in all required fields",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const startDateTime = `${date}T${startTime}:00Z`;
    const endDateTime = `${date}T${endTime}:00Z`;

    try {
      await createEvent.mutateAsync({
        title,
        description: description || undefined,
        startTime: startDateTime,
        endTime: endDateTime,
      });

      toaster.create({
        title: "Event created",
        description: "Your event has been added successfully",
        type: "success",
        duration: 3000,
      });

      setTitle("");
      setDescription("");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      toaster.create({
        title: "Error",
        description: (error as Error).message,
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Heading size="md" mb={4} color="blackAlpha.800">
        Add New Event
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch" color="blackAlpha.700">
          <Field.Root required>
            <Field.Label>Title</Field.Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description (optional)"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Date</Field.Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min="2025-01-01"
              max="2099-12-31"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Start Time</Field.Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>End Time</Field.Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Field.Root>

          <Button
            type="submit"
            colorPalette="teal"
            loading={createEvent.isPending}
          >
            Create Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
