import { tryCatch } from "./common";
import { Event } from "./add-calendar";

const gptModel = "gpt-3.5-turbo";
const OPENAI_SECRET_KEY =
  PropertiesService.getScriptProperties().getProperty("OPENAI_SECRET_KEY")!;
const BODY_THRESHOLD = 200;

export const fetchAiAnswer = (title: string, body: string, url: string): Event[] => {
  if (body.length < BODY_THRESHOLD) {
    throw new Error(`本文が${BODY_THRESHOLD}文字以下です。内容が少ないのでスキップします。: "${body.length}文字"`);
  }

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
    throw new Error(`OPENAI APIのキックに失敗しました: "${apiError.message}"`);
  }
  const payload = JSON.parse(apiResult.getContentText());
  Logger.log(payload);
  const answer = payload.choices[0].message.content
  const eventJson = answer.replace(/```json|```/g, '').trim();
  const eventArray = JSON.parse(eventJson) as Event[];
  return eventArray.map((event) => {
    return {
      ...event,
      originalUrl: url,
    };
  });
}

const createPrompt = (content: string): string => {
  const prompt = `こちらは、イベントの情報を表すjsonのサンプルです。
  {
    "title": "コーヒーイベント",
    "description": "コーヒーイベントです。",
    "startAt": "2019-01-01T10:00:00+09:00",
    "endAt": "2019-01-01T12:00:00+09:00",
    "location": "東京都渋谷区道玄坂1-2-3 渋谷ビル",
    "url": "https://example.com",
    "price": 1000
  },
  {
    "title": "ティーイベント",
    "description": "ティーイベントです。",
    "startAt": "2019-02-01T10:00:00+09:00",
    "endAt": "2019-02-01T12:00:00+09:00",
    "location": "東京都新宿区新宿1-1-1 新宿ビル",
    "url": "https://example.com",
    "price": 800
  },
  {
    "title": "1Dayパーティ",
    "description": "楽しい1Dayパーティです。",
    "startAt": "2019-03-01T00:00:00Z",
    "endAt": "",
    "location": "東京都中野区",
    "url": "https://example.com",
    "price": 3000
  }
  
  こちらの記事の中に、一般人が参加可能なイベントの情報があれば、上記のようなjsonにしてください。
  複数ある場合は複数のjsonを出力してください。
  わからない情報は空文字にしてください。
  終日のイベントの場合は、endAtを空文字にして、時間以降を00:00:00Zにしてください。
  また、イベントの情報がない場合は、空の配列を返してください。
  ===
  ${content}`;
  return prompt;
};
