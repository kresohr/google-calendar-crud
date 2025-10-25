import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/database";
import { getDateRange } from "../utils/dateRange";

/**
 * This is a service class for Google Calendar to abstract out logic
 * for fetching and posting new events from the calendar
 */
export class CalendarService {
  private oauth2Client: OAuth2Client;

  constructor(accessToken: string, refreshToken: string) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  private getCalendarClient() {
    return google.calendar({
      version: "v3",
      auth: this.oauth2Client,
    });
  }

  /**
   * Fetch events from Google Calendar (±6 months from today)
   */
  async fetchEventsFromGoogle() {
    const calendar = this.getCalendarClient();

    const { start, end } = getDateRange();

    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        maxResults: 2500,
        singleEvents: true,
        orderBy: "startTime",
      });

      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching events from Google:", error);
      throw error;
    }
  }

  /**
   * Sync events from Google Calendar to database
   */
  async syncEventsToDatabase(userId: string) {
    const googleEvents = await this.fetchEventsFromGoogle();

    const validEvents = googleEvents
      .filter((event) => {
        const hasRequired = event.id && event.summary;
        const startTime = event.start?.dateTime || event.start?.date;
        const endTime = event.end?.dateTime || event.end?.date;
        return hasRequired && startTime && endTime;
      })
      .map((event) => ({
        googleId: event.id!,
        userId,
        title: event.summary!,
        description: event.description || null,
        startTime: new Date(event.start!.dateTime || event.start!.date!),
        endTime: new Date(event.end!.dateTime || event.end!.date!),
      }));

    const googleEventIds = validEvents.map((event) => event.googleId);

    const result = await Promise.all(
      validEvents.map((eventData) =>
        prisma.event.upsert({
          where: { googleId: eventData.googleId },
          update: {
            title: eventData.title,
            description: eventData.description,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
          },
          create: eventData,
        })
      )
    );

    await prisma.event.deleteMany({
      where: {
        userId,
        googleId: {
          notIn: googleEventIds,
        },
      },
    });

    return result.length;
  }

  /**
   * Create a new event in Google Calendar
   */
  async createEventAndSync(
    userId: string,
    title: string,
    description: string | null,
    startTime: Date,
    endTime: Date
  ) {
    const calendar = this.getCalendarClient();

    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: title,
          description: description || null,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: "UTC",
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: "UTC",
          },
        },
      });

      if (!response.data.id) {
        throw new Error("Google Calendar did not return event ID");
      }

      const event = await prisma.event.create({
        data: {
          googleId: response.data.id,
          userId,
          title,
          description,
          startTime,
          endTime,
        },
      });

      return event;
    } catch (error) {
      console.error("Error creating event in Google Calendar:", error);
      throw error;
    }
  }

  /**
   * Get all events from database within ±6 months
   * @param userId - User ID to fetch events for
   */
  async getEventsFromDatabase(userId: string) {
    const { start, end } = getDateRange();

    const events = await prisma.event.findMany({
      where: {
        userId,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      orderBy: [{ startTime: "asc" }, { createdAt: "asc" }],
    });

    return events;
  }
}
