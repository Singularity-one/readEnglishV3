import { defineStore } from 'pinia';
import * as XLSX from 'xlsx';

export const useSentenceStore = defineStore('sentence', {
  state: () => ({
    sentences: [],           // 所有短句
    currentLevel: '',        // 目前難度 (basic/intermediate/advanced)
    currentIndex: 0,         // 目前練到第幾句（新句子）
    todayCount: 0,           // 今日練習數量
    newCount: 0,             // 新句子計數（達到 3 就插入複習句）
    currentSentence: null,   // 目前顯示的句子
    isLoading: false,        // 載入狀態
    error: null,             // 錯誤訊息
  }),

  getters: {
    // 需要複習的句子列表
    reviewList: (state) => {
      return state.sentences.filter(s => s.needReview === 'Y');
    },

    // 總句數
    totalSentences: (state) => {
      return state.sentences.length;
    },

    // 需要複習的句數
    reviewCount: (state) => {
      return state.sentences.filter(s => s.needReview === 'Y').length;
    },

    // 已練習的新句子數
    learnedCount: (state) => {
      return state.currentIndex;
    },
  },

  actions: {
    // 載入指定難度的短句 Excel
    async loadSentences(level) {
      this.isLoading = true;
      this.error = null;
      this.currentLevel = level;

      try {
        const fileName = `sentences-${level}.xlsx`;
        const url = process.env.BASE_URL + `excel/${fileName}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`找不到檔案：${fileName}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // 讀取第一個 sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 解析資料
        this.sentences = jsonData.map(row => ({
          id: row.id,
          sentence: row.sentence || '',
          targetWords: (row.targetWords || '').split(',').map(w => w.trim().toLowerCase()),
          grammar: row.grammar || '',
          category: row.category || '',
          needReview: row.needReview || 'N',
        }));

        // 從 localStorage 載入進度
        this.loadProgress(level);

        // 檢查是否需要重置今日計數
        this.checkDailyReset();

        console.log(`✅ 載入 ${fileName} 成功：${this.sentences.length} 句`);
        return true;

      } catch (error) {
        console.error('❌ 載入短句 Excel 失敗:', error);
        this.error = error.message;
        return false;

      } finally {
        this.isLoading = false;
      }
    },

    // 從 localStorage 載入進度
    loadProgress(level) {
      const indexKey = `sentence-index-${level}`;
      const savedIndex = localStorage.getItem(indexKey);
      this.currentIndex = savedIndex ? parseInt(savedIndex, 10) : 0;

      const todayCountKey = 'sentence-today-count';
      const savedTodayCount = localStorage.getItem(todayCountKey);
      this.todayCount = savedTodayCount ? parseInt(savedTodayCount, 10) : 0;
    },

    // 儲存進度到 localStorage
    saveProgress() {
      const indexKey = `sentence-index-${this.currentLevel}`;
      localStorage.setItem(indexKey, this.currentIndex.toString());

      localStorage.setItem('sentence-today-count', this.todayCount.toString());
      localStorage.setItem('sentence-today-date', this.getTodayDate());
    },

    // 取得今天日期 (YYYY-MM-DD)
    getTodayDate() {
      const now = new Date();
      return now.toISOString().split('T')[0];
    },

    // 檢查是否需要重置今日計數
    checkDailyReset() {
      const savedDate = localStorage.getItem('sentence-today-date');
      const today = this.getTodayDate();

      if (savedDate !== today) {
        this.todayCount = 0;
        this.newCount = 0;
        localStorage.setItem('sentence-today-date', today);
        localStorage.setItem('sentence-today-count', '0');
      }
    },

    // 取得下一句（含 3:1 複習邏輯）
    getNextSentence() {
      if (this.sentences.length === 0) {
        this.currentSentence = null;
        return null;
      }

      this.newCount++;

      // 每 3 句新的，插入 1 句複習
      if (this.newCount >= 3 && this.reviewList.length > 0) {
        // 從複習清單隨機抽一句
        const randomIndex = Math.floor(Math.random() * this.reviewList.length);
        this.currentSentence = this.reviewList[randomIndex];
        this.newCount = 0;
      } else {
        // 取新句子
        if (this.currentIndex >= this.sentences.length) {
          // 已經練完全部，從頭開始或只練複習
          if (this.reviewList.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.reviewList.length);
            this.currentSentence = this.reviewList[randomIndex];
          } else {
            // 全部練完且沒有複習句，從頭開始
            this.currentIndex = 0;
            this.currentSentence = this.sentences[0];
            this.currentIndex++;
          }
        } else {
          this.currentSentence = this.sentences[this.currentIndex];
          this.currentIndex++;
        }
      }

      // 更新今日練習數
      this.todayCount++;
      this.saveProgress();

      return this.currentSentence;
    },

    // 更新 needReview（呼叫 API，只有本機有效）
    async updateReview(id, needReview) {
      try {
        const response = await fetch('/api/update-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            needReview: needReview,
            level: this.currentLevel,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // 更新本地資料
          const sentence = this.sentences.find(s => s.id === id);
          if (sentence) {
            sentence.needReview = needReview;
          }
          console.log(`✅ ${result.message}`);
          return true;
        } else {
          console.warn(`⚠️ 更新失敗：${result.message}`);
          // GitHub Pages 上會失敗，這是正常的
          return false;
        }

      } catch (error) {
        // GitHub Pages 上沒有 API，會進到這裡
        console.warn('⚠️ 無法呼叫 API（可能在 GitHub Pages 上）:', error.message);
        
        // 只更新本地資料（不會存到 Excel）
        const sentence = this.sentences.find(s => s.id === id);
        if (sentence) {
          sentence.needReview = needReview;
        }
        return false;
      }
    },

    // 切換 needReview
    async toggleReview(id) {
      const sentence = this.sentences.find(s => s.id === id);
      if (sentence) {
        const newValue = sentence.needReview === 'Y' ? 'N' : 'Y';
        await this.updateReview(id, newValue);
      }
    },

    // 取得單一句子的完整資訊
    getSentenceInfo(id) {
      return this.sentences.find(s => s.id === id) || null;
    },

    // 重置進度
    resetProgress() {
      this.currentIndex = 0;
      this.newCount = 0;
      this.currentSentence = null;
      this.saveProgress();
    },

    // 重置今日計數
    resetTodayCount() {
      this.todayCount = 0;
      localStorage.setItem('sentence-today-count', '0');
    },
  },
});