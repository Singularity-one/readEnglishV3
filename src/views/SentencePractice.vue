<template>
  <div class="sentence-practice-page">
    <div class="container">
      <!-- 頂部導航列 -->
      <div class="top-bar">
        <router-link to="/sentence-level" class="back-btn">← 返回</router-link>
        <h2 class="level-title">{{ levelName }}練習</h2>
        <div class="today-count">今日：{{ sentenceStore.todayCount }} 句</div>
      </div>

      <!-- 載入中 -->
      <div v-if="sentenceStore.isLoading" class="loading">
        載入中...
      </div>

      <!-- 錯誤訊息 -->
      <div v-else-if="sentenceStore.error" class="error">
        {{ sentenceStore.error }}
      </div>

      <!-- 主要練習區 -->
      <div v-else-if="sentenceStore.currentSentence" class="practice-area">
        <!-- 短句顯示區 -->
        <div class="sentence-display" @click="showInfo = true">
          <p v-if="!isHidden" class="sentence-text">
            {{ sentenceStore.currentSentence.sentence }}
          </p>
          <p v-else class="sentence-hidden">
            （短句已隱藏，點擊播放按鈕聽寫）
          </p>
          <p class="click-hint">點擊查看單字和文法解析</p>
        </div>

        <!-- 控制按鈕列 -->
        <div class="control-bar">
          <button @click="toggleHidden" class="control-btn">
            {{ isHidden ? '👁 顯示' : '🙈 隱藏' }}
          </button>
          
          <!-- 音頻播放元件 -->
          <SentenceAudioPlayer 
            :sentence="sentenceStore.currentSentence.sentence" 
          />
          
          <button @click="toggleReview" class="control-btn" :class="{ active: sentenceStore.currentSentence.needReview === 'Y' }">
            {{ sentenceStore.currentSentence.needReview === 'Y' ? '🔁 需複習' : '✓ 不複習' }}
          </button>
        </div>

        <!-- 盲打元件 -->
        <TypingSentence
          :sentence="sentenceStore.currentSentence.sentence"
          :isHidden="isHidden"
          @completed="onTypingCompleted"
        />

        <!-- 下一句按鈕 -->
        <div class="next-bar">
          <button @click="nextSentence" class="next-btn">
            下一句 →
          </button>
        </div>

        <!-- 進度資訊 -->
        <div class="progress-info">
          <span>進度：{{ sentenceStore.learnedCount }} / {{ sentenceStore.totalSentences }}</span>
          <span>複習清單：{{ sentenceStore.reviewCount }} 句</span>
        </div>
      </div>

      <!-- 沒有句子 -->
      <div v-else class="no-sentence">
        <p>目前沒有句子可練習</p>
        <button @click="loadFirstSentence" class="start-btn">開始練習</button>
      </div>

      <!-- 單字和文法解析彈窗 -->
      <Sentenceinfo
        v-if="showInfo && sentenceStore.currentSentence"
        :sentence="sentenceStore.currentSentence"
        :wordExplanations="wordExplanations"
        @close="showInfo = false"
      />
    </div>
  </div>
</template>

<script>
import { useSentenceStore } from '@/stores/sentenceStore';
import { useExcelStore } from '@/stores/excelStore';
import TypingSentence from '@/components/TypingSentence.vue';
import Sentenceinfo from '@/components/Sentenceinfo.vue';
import SentenceAudioPlayer from '@/components/SentenceAudioPlayer.vue';
import * as XLSX from 'xlsx';

export default {
  name: 'SentencePractice',
  components: {
    TypingSentence,
    Sentenceinfo,
    SentenceAudioPlayer,
  },
  data() {
    return {
      sentenceStore: useSentenceStore(),
      excelStore: useExcelStore(),
      isHidden: false,        // 是否隱藏短句（聽打模式）
      showInfo: false,        // 是否顯示單字文法彈窗
      wordExplanations: {},   // 單字解釋（從 default.xlsx）
    };
  },
  computed: {
    level() {
      return this.$route.params.level || 'basic';
    },
    levelName() {
      const names = {
        basic: '基礎',
        intermediate: '中級',
        advanced: '進階',
      };
      return names[this.level] || '基礎';
    },
  },
  async created() {
    // 載入單字 Excel（如果尚未載入）
    await this.loadWordExcel();

    // 載入短句 Excel
    await this.sentenceStore.loadSentences(this.level);

    // 取得第一句
    if (this.sentenceStore.sentences.length > 0 && !this.sentenceStore.currentSentence) {
      this.sentenceStore.getNextSentence();
    }
  },
  methods: {
    // 載入單字 Excel
    async loadWordExcel() {
      if (Object.keys(this.excelStore.wordExplanations).length === 0) {
        try {
          const url = process.env.BASE_URL + 'excel/default.xlsx';
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          let allData = [];
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            allData = allData.concat(jsonData);
          });

          if (allData.length > 0) {
            this.excelStore.setExcelData(Object.keys(allData[0]), allData);
          }
        } catch (error) {
          console.error('載入單字 Excel 失敗:', error);
        }
      }

      this.wordExplanations = this.excelStore.wordExplanations;
    },

    // 切換隱藏/顯示
    toggleHidden() {
      this.isHidden = !this.isHidden;
    },

    // 切換複習狀態
    async toggleReview() {
      if (this.sentenceStore.currentSentence) {
        await this.sentenceStore.toggleReview(this.sentenceStore.currentSentence.id);
      }
    },

    // 下一句
    nextSentence() {
      this.sentenceStore.getNextSentence();
      this.showInfo = false;
    },

    // 打字完成回調
    onTypingCompleted() {
      console.log('打字完成！');
    },

    // 開始練習（載入第一句）
    loadFirstSentence() {
      this.sentenceStore.getNextSentence();
    },
  },

  // 監聽路由變化（切換難度時重新載入）
  watch: {
    '$route.params.level': {
      handler(newLevel) {
        if (newLevel) {
          this.sentenceStore.loadSentences(newLevel);
        }
      },
    },
  },
};
</script>

<style scoped>
.sentence-practice-page {
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

/* 頂部導航列 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-btn {
  color: #3498db;
  text-decoration: none;
  font-size: 1rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.level-title {
  margin: 0;
  font-size: 1.3rem;
  color: #2c3e50;
}

.today-count {
  color: #27ae60;
  font-weight: bold;
}

/* 載入和錯誤狀態 */
.loading, .error, .no-sentence {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error {
  color: #e74c3c;
}

/* 短句顯示區 */
.sentence-display {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.sentence-display:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.sentence-text {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 10px;
}

.sentence-hidden {
  font-size: 1.1rem;
  color: #95a5a6;
  font-style: italic;
  margin-bottom: 10px;
}

.click-hint {
  font-size: 0.85rem;
  color: #bdc3c7;
}

/* 控制按鈕列 */
.control-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #ecf0f1;
  color: #2c3e50;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #bdc3c7;
}

.control-btn.active {
  background: #3498db;
  color: white;
}

/* 下一句按鈕 */
.next-bar {
  margin-top: 20px;
  text-align: center;
}

.next-btn {
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  background: #27ae60;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.next-btn:hover {
  background: #219a52;
}

/* 進度資訊 */
.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* 開始按鈕 */
.start-btn {
  margin-top: 20px;
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  background: #3498db;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
}

.start-btn:hover {
  background: #2980b9;
}
</style>