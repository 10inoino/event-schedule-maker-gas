import { Event, AddCalendarEvent } from "./add-calendar";
import { PostMessageToSlack } from "./post-to-slack";

const addCalendarEventTest = () => {
  const event: Event = {
    title: "テスト" + new Date().toISOString(),
    description: "テストです",
    startAt: "2024-06-30T10:00:00Z",
    endAt: undefined,
    location: "東京都渋谷区",
    originalUrl: "https://example.com",
    url: "https://example.com",
    price: 1000,
  };
  AddCalendarEvent(event);
}

const postMessageToSlackTest = () => {
  PostMessageToSlack("テストメッセージ");
}
