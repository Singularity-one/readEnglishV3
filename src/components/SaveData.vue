<template>
    <div>
      <h2>保存的資料</h2>
      <p>表頭: {{ headers }}</p>
      <p>數據行數: {{ tableData.length }}</p>
    </div>
  </template>
  
  <script>
  import { useExcelStore } from '@/stores/excelStore';
  
  export default {
    name: "SaveData",
    setup() {
      const excelStore = useExcelStore();
  
      return {
        headers: excelStore.headers,
        tableData: excelStore.tableData,
      };
    },
  };
  </script>