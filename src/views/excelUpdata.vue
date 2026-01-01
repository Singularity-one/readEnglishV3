<template>
  <div>
    <div>
      <!-- 檔案上傳按鈕 -->
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept=".xlsx, .xls"
        style="display: none;"
      />
      <button @click="triggerFileInput" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-folder-upload"></i>
      </button>
    </div>

    <!-- 顯示 Excel 內容 -->
    <div v-if="headers.length">
      <h3>標題</h3>
      <ul>
        <li v-for="(header, i) in headers" :key="i">{{ header }}</li>
      </ul>

      <h3>資料列</h3>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th v-for="(header, i) in headers" :key="i">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td v-for="(header, i) in headers" :key="i">
              {{ row[header] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { useExcelStore } from '@/stores/excelStore';

export default {
  name: 'ExcelUploader',
  data() {
    return {
      headers: [],
      tableData: [],
    };
  },
  setup() {
    const excelStore = useExcelStore();
    return { excelStore };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let allData = [];
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          allData = allData.concat(jsonData);
        });

        if (allData.length === 0) return;
        this.headers = Object.keys(allData[0]); // 動態抓所有欄位
        this.tableData = allData;

        // 更新到 store
        this.excelStore.setExcelData(this.headers, this.tableData);
      };
      reader.readAsArrayBuffer(file);
    },
  },
};
</script>