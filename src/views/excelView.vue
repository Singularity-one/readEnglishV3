<template>
  <div>
    <h2>Excel 數據展示</h2>
    <table v-if="tableData.length">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <td v-for="(header, cellIndex) in headers" :key="cellIndex">{{ row[header] }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>目前沒有數據</p>
  </div>
</template>

<script>
import { useExcelStore } from '@/stores/excelStore';

export default {
  name: 'ExcelView',
  setup() {
    const excelStore = useExcelStore();
    return {
      headers: excelStore.headers,
      tableData: excelStore.tableData,
    };
  },
};
</script>