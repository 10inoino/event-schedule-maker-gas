import { ExtractContent } from "./extract-content";

function test() {
  const mainSheet = getSheet();
  const link = mainSheet.getRange("B3").getValue();
  const [error, result] = tryCatch(() => UrlFetchApp.fetch(link));
  if (error) {
    return `URLの参照に失敗しました: "${error.message}"`;
  }
  const html = result.getContentText();
  const content = new ExtractContent()
    .analyse(html, {
      threshold: 1,
    })
    .asText();
  Logger.log(content.body);
  fetchAiAnswer(content.title, content.body);
}
