<template>
  <div class="sentence-info-overlay" @click.self="$emit('close')">
    <div class="sentence-info-panel">
      <!-- 標題列 -->
      <div class="panel-header">
        <h3>句子解析</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>

      <!-- 句子 -->
      <div class="sentence-section">
        <p class="sentence-text">{{ sentence.sentence }}</p>
        <button @click="speakSentence" class="speak-btn">🔊 播放</button>
      </div>

      <!-- 單字列表 -->
      <div class="words-section">
        <h4>📖 重點單字</h4>
        <div v-if="wordList.length > 0" class="word-list">
          <div 
            v-for="word in wordList" 
            :key="word.word" 
            class="word-item"
          >
            <div class="word-header">
              <strong class="word-text">{{ word.word }}</strong>
              <span v-if="word.partOfSpeech" class="word-pos">({{ word.partOfSpeech }})</span>
              <button @click="speakWord(word.word)" class="speak-word-btn">🔊</button>
            </div>
            <p v-if="word.translation" class="word-translation">{{ word.translation }}</p>
            <p v-if="word.explanation" class="word-explanation">{{ word.explanation }}</p>
          </div>
        </div>
        <p v-else class="no-data">沒有找到單字資料</p>
      </div>

      <!-- 文法解析 -->
      <div class="grammar-section">
        <h4>📝 文法解析</h4>
        <div v-if="grammarList.length > 0" class="grammar-list">
          <div 
            v-for="(item, index) in grammarList" 
            :key="index" 
            class="grammar-item"
          >
            <span class="grammar-label">{{ item.label }}</span>
            <span class="grammar-content">{{ item.content }}</span>
            <span class="grammar-desc">→ {{ item.description }}</span>
          </div>
        </div>
        <p v-else class="no-data">沒有文法資料</p>
      </div>

      <!-- 分類 -->
      <div v-if="sentence.category" class="category-section">
        <span class="category-tag">{{ sentence.category }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SentenceInfo',
  props: {
    sentence: {
      type: Object,
      required: true,
    },
    wordExplanations: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    // 解析單字列表
    wordList() {
      if (!this.sentence.targetWords || !Array.isArray(this.sentence.targetWords)) {
        return [];
      }

      return this.sentence.targetWords.map(word => {
        const lowerWord = word.toLowerCase();
        return {
          word: word,
          translation: this.getWordData(lowerWord, 'wordTranslations'),
          explanation: this.getWordData(lowerWord, 'wordExplanations'),
          partOfSpeech: this.getWordData(lowerWord, 'wordPartsOfSpeech'),
        };
      });
    },

    // 解析文法列表
    grammarList() {
      if (!this.sentence.grammar) {
        return [];
      }

      // 格式：[主句]The report has been reviewed→現在完成被動;[子句1]that was submitted→關係代名詞
      const items = this.sentence.grammar.split(';');
      
      return items.map(item => {
        // 解析 [標籤]內容→說明
        const labelMatch = item.match(/^\[(.+?)\]/);
        const label = labelMatch ? labelMatch[1] : '';
        
        const rest = labelMatch ? item.replace(/^\[.+?\]/, '') : item;
        const parts = rest.split('→');
        
        return {
          label: label,
          content: parts[0]?.trim() || '',
          description: parts[1]?.trim() || '',
        };
      }).filter(item => item.content || item.description);
    },
  },
  methods: {
    // 從 excelStore 取得單字資料
    getWordData(word, dataType) {
      // 嘗試從父元件傳入的 wordExplanations 取得
      // 注意：這裡需要存取完整的 excelStore 資料
      const store = this.$parent?.excelStore;
      if (store && store[dataType]) {
        return store[dataType][word] || '';
      }
      
      // 如果是 wordExplanations，直接從 props 取
      if (dataType === 'wordExplanations' && this.wordExplanations[word]) {
        return this.wordExplanations[word];
      }
      
      return '';
    },

    // 播放句子
    speakSentence() {
      this.speak(this.sentence.sentence);
    },

    // 播放單字
    speakWord(word) {
      this.speak(word);
    },

    // 語音合成
    speak(text) {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;

        const voices = synth.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) ||
                        voices.find(v => v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }

        synth.speak(utterance);
      }
    },
  },
};
</script>

<style scoped>
.sentence-info-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.sentence-info-panel {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

/* 標題列 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.panel-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

/* 句子區 */
.sentence-section {
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.sentence-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 10px;
}

.speak-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #3498db;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.speak-btn:hover {
  background: #2980b9;
}

/* 單字區 */
.words-section {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.words-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.word-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.word-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.word-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.word-text {
  font-size: 1.1rem;
  color: #2c3e50;
}

.word-pos {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.speak-word-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 2px 6px;
}

.speak-word-btn:hover {
  background: #eee;
  border-radius: 4px;
}

.word-translation {
  color: #27ae60;
  margin: 5px 0;
  font-weight: 500;
}

.word-explanation {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 5px 0;
}

/* 文法區 */
.grammar-section {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.grammar-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.grammar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grammar-item {
  padding: 12px 15px;
  background: #fff9e6;
  border-radius: 8px;
  border-left: 4px solid #f39c12;
}

.grammar-label {
  display: inline-block;
  background: #f39c12;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-right: 10px;
}

.grammar-content {
  color: #2c3e50;
  font-family: 'Courier New', monospace;
}

.grammar-desc {
  display: block;
  margin-top: 8px;
  color: #7f8c8d;
  font-size: 0.95rem;
}

/* 分類區 */
.category-section {
  padding: 15px 20px;
}

.category-tag {
  display: inline-block;
  padding: 5px 12px;
  background: #e8f5e9;
  color: #27ae60;
  border-radius: 20px;
  font-size: 0.9rem;
}

/* 無資料 */
.no-data {
  color: #bdc3c7;
  font-style: italic;
}
</style>