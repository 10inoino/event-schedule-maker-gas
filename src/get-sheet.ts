const getSheet = () => {
  const activeSpreadSheet = () => SpreadsheetApp.getActiveSpreadsheet();
  return activeSpreadSheet().getSheetByName("シート1")!;
};
