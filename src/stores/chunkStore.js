import { defineStore } from 'pinia';
import * as XLSX from 'xlsx';

export const useChunkStore = defineStore('chunk', {
  state: () => ({
    chunks: [],              // chunk 列表 ['climate change', 'rising temperatures', ...]
    chunkTypes: {},          // { 'climate change': 'collocation', ... }
    chunkExplanations: {},   // { 'climate change': 'long-term changes...', ... }
    chunkExamples: {},       // { 'climate change': 'Climate change is...', ... }
    currentFile: '',         // 目前載入的檔案名稱
    isLoading: false,        // 載入狀態
    error: null,             // 錯誤訊息
  }),

  getters: {
    // 取得所有 chunks
    allChunks: (state) => state.chunks,
    
    // 依類型統計
    chunkStats: (state) => {
      const stats = {
        total: state.chunks.length,
        byType: {
          collocation: 0,
          phrasal_verb: 0,
          idiom: 0,
          fixed_phrase: 0,
          other: 0
        }
      };

      state.chunks.forEach(chunk => {
        const type = state.chunkTypes[chunk];
        if (type && Object.prototype.hasOwnProperty.call(stats.byType, type)) {
          stats.byType[type]++;
        } else {
          stats.byType.other++;
        }
      });

      return stats;
    },

    // 依類型篩選
    getChunksByType: (state) => (type) => {
      if (type === 'all') {
        return state.chunks;
      }
      return state.chunks.filter(chunk => state.chunkTypes[chunk] === type);
    }
  },

  actions: {
    // 載入 Chunk Excel 檔案
    async loadChunksExcel(fileName) {
      this.isLoading = true;
      this.error = null;

      try {
        const url = process.env.BASE_URL + `excel/chunks/${fileName}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`找不到檔案: ${fileName}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // 讀取第一個 sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const chunksData = XLSX.utils.sheet_to_json(firstSheet);

        this.parseChunksData(chunksData);
        this.currentFile = fileName;
        
        console.log(`✅ 成功載入 ${fileName}:`, this.chunks.length, '個 chunks');
        return true;

      } catch (error) {
        console.error('❌ 載入 Chunks Excel 失敗:', error);
        this.error = error.message;
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    // 解析 Chunks 資料
    parseChunksData(chunksData) {
      // 清空舊資料
      this.chunks = [];
      this.chunkTypes = {};
      this.chunkExplanations = {};
      this.chunkExamples = {};

      chunksData.forEach(row => {
        // 把欄位名轉小寫,避免大小寫不一致
        const rowLower = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            rowLower[key.toLowerCase()] = row[key];
          }
        }

        const chunk = (rowLower['chunk'] || '').toString().toLowerCase().trim();
        
        if (chunk) {
          // 加入 chunks 列表
          if (!this.chunks.includes(chunk)) {
            this.chunks.push(chunk);
          }

          // 儲存 chunk 的資訊
          this.chunkTypes[chunk] = (rowLower['chunktype'] || '').toString().trim();
          this.chunkExplanations[chunk] = (rowLower['chunkexplanation'] || '').toString().trim();
          this.chunkExamples[chunk] = (rowLower['chunkexample'] || '').toString().trim();
        }
      });

      // 排序 chunks
      this.chunks.sort();
    },

    // 清空所有資料
    clearChunks() {
      this.chunks = [];
      this.chunkTypes = {};
      this.chunkExplanations = {};
      this.chunkExamples = {};
      this.currentFile = '';
      this.error = null;
    },

    // 取得單一 chunk 的完整資訊
    getChunkInfo(chunk) {
      const normalizedChunk = chunk.toLowerCase().trim();
      
      if (!this.chunks.includes(normalizedChunk)) {
        return null;
      }

      return {
        chunk: normalizedChunk,
        type: this.chunkTypes[normalizedChunk],
        explanation: this.chunkExplanations[normalizedChunk],
        example: this.chunkExamples[normalizedChunk]
      };
    },

    // 搜尋 chunks
    searchChunks(keyword) {
      const lowerKeyword = keyword.toLowerCase().trim();
      return this.chunks.filter(chunk => 
        chunk.includes(lowerKeyword)
      );
    }
  }
});