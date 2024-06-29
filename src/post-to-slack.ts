const INCOMING_WEBHOOK_URL =
  PropertiesService.getScriptProperties().getProperty("INCOMING_WEBHOOK_URL")!;

export const PostMessageToSlack = (
  message: string,
) => {
  UrlFetchApp.fetch(INCOMING_WEBHOOK_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      text: message,
    }),
  });
};
