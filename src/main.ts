function test() {
  const activeSpreadSheet = () => SpreadsheetApp.getActiveSpreadsheet();
  const mainSheet = activeSpreadSheet().getSheetByName("シート1")!;
  const result = mainSheet.getRange("A3").getValue();
  Logger.log(`結果: ${result}`);
}
