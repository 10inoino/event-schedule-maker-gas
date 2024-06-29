import { AddCalendarEvent } from "./add-calendar";
import { tryCatch } from "./common";
import { ExtractContent } from "./extract-content";
import { fetchAiAnswer } from "./fetch-ai-answer";
import { getURLs } from "./get-sheet";
import { PostMessageToSlack } from "./post-to-slack";

const createEvent = () => {
  const targetURLs = getURLs();
  var successCount = 0;
  for (const url of targetURLs) {
    try {
      const [error, result] = tryCatch(() => UrlFetchApp.fetch(url));
      if (error) {
        throw new Error(`URLの参照に失敗しました: "${error.message}"`);
      }
      const html = result.getContentText();
      const content = new ExtractContent()
        .analyse(html, {
          threshold: 1,
        })
        .asText();
      Logger.log(content.body);
      const events = fetchAiAnswer(content.title, content.body, url);
      for (const event of events) {
        AddCalendarEvent(event);
      }
      Logger.log("success");
      successCount++;
    } catch (e) {
      Logger.log(`failed: ${e}`);
    }
    Logger.log("==========");
  }
  PostMessageToSlack(`イベントの登録が完了しました。
  取得したURL数: ${targetURLs.length} 件
  登録数: ${successCount} 件
  登録完了日時: ${new Date().toISOString()}`);
}
