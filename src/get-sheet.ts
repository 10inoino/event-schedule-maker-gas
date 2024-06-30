export const getURLs = (): string[] => {
  const activeSpreadSheet = () => SpreadsheetApp.getActiveSpreadsheet();
  const sheets = activeSpreadSheet().getSheets();
  const result: string[] = [];

  for (const sheet of sheets) {
    if (sheet.getLastRow() < 3) continue;
    const data = sheet.getRange(3, 1, sheet.getLastRow() - 2, 1).getValues();
    const urls = data.map((row) => row[0]);
    result.push(...urls);
  }

  return result;
};
