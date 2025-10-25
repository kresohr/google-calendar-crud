import express from "express";
import { CalendarService } from "../services/calendar";
import { getDateRange, isDateInRange } from "../utils/dateRange";

const router = express.Router();

/**
 *  This is where we check whether the user is authenticated.
 *  If the user tries to fetch any route from this file without being authenticated, he'll see an error message.
 */
router.use((req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
});

// Get all the events for the authenticated user from local db
router.get("/api/events", async (req, res) => {
  try {
    const user = req.session.user!;

    const calendarService = new CalendarService(
      user.accessToken,
      user.refreshToken
    );

    const events = await calendarService.getEventsFromDatabase(user.id);

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Create a new event in Google Calendar and store in local db right away
router.post("/api/events", async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    const user = req.session.user!;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const eventStartTime = new Date(startTime);

    if (!isDateInRange(eventStartTime)) {
      const { start, end } = getDateRange();
      return res.status(400).json({
        error: "Event must be within ±6 months from today",
        allowedRange: {
          min: start.toISOString(),
          max: end.toISOString(),
        },
      });
    }
    const calendarService = new CalendarService(
      user.accessToken,
      user.refreshToken
    );

    const event = await calendarService.createEventAndSync(
      user.id,
      title,
      description || null,
      eventStartTime,
      new Date(endTime)
    );

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

/* 
    Sync events from Google Calendar and store them in our local DB if they are not already existing
    First time users will have local db empty so we have to fetch all the events from Google Calendar first
*/
router.post("/api/events/sync", async (req, res) => {
  try {
    const user = req.session.user!;

    const calendarService = new CalendarService(
      user.accessToken,
      user.refreshToken
    );
    const syncedCount = await calendarService.syncEventsToDatabase(user.id);

    res.json({ success: true, syncedCount });
  } catch (error) {
    console.error("Error syncing events:", error);
    res.status(500).json({ error: "Failed to sync events" });
  }
});

export default router;
