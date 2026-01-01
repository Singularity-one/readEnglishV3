import { reactive } from 'vue';

export const excelData = reactive({
  headers: [],
  tableData: [],
  setExcelData(headers, tableData) {
    this.headers = headers;
    this.tableData = tableData;
  },
});