const gptModel = "gpt-3.5-turbo";
const OPENAI_SECRET_KEY =
  PropertiesService.getScriptProperties().getProperty("OPENAI_SECRET_KEY")!;

const fetchAiAnswer = (title: string, body: string): string => {
  const option = {
    method: "post",
    headers: {
      Authorization: "Bearer " + OPENAI_SECRET_KEY,
      Accept: "application/json",
    },
    contentType: "application/json",
    payload: JSON.stringify({
      model: gptModel,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "assistant", content: `【Title】${title}` },
        {
          role: "user",
          content: createPrompt(body),
        },
      ],
      temperature: 0.0,
    }),
  } as const;
  const [apiError, apiResult] = tryCatch(() =>
    UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", option),
  );
  if (apiError) {
    return `APIリクエストに失敗しました: ${apiError.message}`;
  }
  const payload = JSON.parse(apiResult.getContentText());
  Logger.log(payload);
  return payload;
}

const createPrompt = (content: string): string => {
  const prompt = `こちらは、イベントの情報を表すjsonです。
  {
    "title": "コーヒーイベント",
    "description": "コーヒーイベントです。",
    "startAt": "2019-01-01T10:00:00+09:00",
    "endAt": "2019-01-01T12:00:00+09:00",
    "location": "東京都渋谷区",
    "url": "https://example.com",
    "price": 1000
  },
  {
    "title": "ティーイベント",
    "description": "ティーイベントです。",
    "startAt": "2019-02-01T10:00:00+09:00",
    "endAt": "2019-02-01T12:00:00+09:00",
    "location": "東京都新宿区",
    "url": "https://example.com",
    "price": 800
  },
  {
    "title": "ワインイベント",
    "description": "ワインイベントです。",
    "startAt": "2019-03-01T18:00:00+09:00",
    "endAt": "2019-03-01T21:00:00+09:00",
    "location": "東京都中野区",
    "url": "https://example.com",
    "price": 3000
  }
  
  こちらの記事の中に、一般人が参加可能なイベントの情報があれば、上記のjsonにしてください。
  複数ある場合は複数のJSONを出力してください。
  わからない情報は空文字にしてください。
  また、イベントの情報がない場合は、空の配列を返してください。
  ${content}`;

  Logger.log(prompt);
  return prompt;
};
