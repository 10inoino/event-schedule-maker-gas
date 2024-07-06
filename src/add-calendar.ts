export type Event = {
  title: string;
  description: string;
  startAt: string;
  endAt?: string;
  location: string;
  originalUrl: string;
  url: string;
  price?: number;
};

const CALENDAR_ID =
  PropertiesService.getScriptProperties().getProperty("CALENDAR_ID")!;

export const AddCalendarEvent = (
  event: Event
) => {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (event.endAt) {
    calendar.createEvent(event.title, new Date(event.startAt), new Date(event.endAt), {
      description: createDescription(event),
      location: event.location,
    });
  } else {
    calendar.createAllDayEvent(event.title, new Date(event.startAt), {
      description: createDescription(event),
      location: event.location,
    })
  }
}

const createDescription = (event: Event): string => {
  return `${event.description}
  originalUrl: ${event.originalUrl}
  url: ${event.url}
  price: ${event.price}
  `;
}


