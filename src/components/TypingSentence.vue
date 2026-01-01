<template>
  <div class="typing-sentence">
    <!-- 打字顯示區 -->
    <div class="typing-display">
      <span
        v-for="(char, index) in sentenceChars"
        :key="index"
        :class="getCharClass(index)"
      >
        <!-- 隱藏模式：只顯示已打對的字，未打的顯示底線 -->
        <template v-if="isHidden">
          {{ index < currentIndex ? (char === ' ' ? '␣' : char) : '_' }}
        </template>
        <!-- 正常模式：顯示全部 -->
        <template v-else>
          {{ char === ' ' ? '␣' : char }}
        </template>
      </span>
    </div>

    <!-- 控制列 -->
    <div class="typing-controls">
      <div class="practice-count">練習次數：{{ practiceCount }}</div>
      <button @click="toggleKeyboard" class="control-btn">
        {{ showKeyboard ? '⌨ 隱藏鍵盤' : '⌨ 顯示鍵盤' }}
      </button>
      <button @click="restart" class="control-btn">
        🔄 重新練習
      </button>
    </div>

    <!-- 完成提示 -->
    <div v-if="isCompleted" class="completed-msg">
      ✅ 完成！可以按「下一句」繼續
    </div>

    <!-- 鍵盤提示 -->
    <div v-if="showKeyboard" class="keyboard-layout">
      <div
        class="keyboard-row"
        v-for="(row, rowIndex) in keyboardRows"
        :key="rowIndex"
      >
        <div
          v-for="key in row"
          :key="key"
          :class="['key', getKeyClass(key)]"
        >
          {{ key === ' ' ? 'Space' : key }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypingSentence',
  props: {
    sentence: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentIndex: 0,
      practiceCount: 0,
      isCompleted: false,
      showKeyboard: true,
      keyboardRows: [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f̲', 'g', 'h', 'j̲', 'k', 'l', ';'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        [' '],
      ],
    };
  },
  computed: {
    sentenceChars() {
      return this.sentence.split('');
    },
    currentChar() {
      return this.sentence[this.currentIndex]?.toLowerCase() || '';
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyInput);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyInput);
  },
  watch: {
    // 當句子改變時重置
    sentence() {
      this.resetState();
    },
  },
  methods: {
    handleKeyInput(event) {
      // 已完成則不處理
      if (this.isCompleted) return;

      // 忽略特殊鍵
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      const key = event.key;
      const expected = this.sentence[this.currentIndex];

      // 比對輸入（不區分大小寫）
      if (key.toLowerCase() === expected.toLowerCase()) {
        this.currentIndex++;

        // 檢查是否完成
        if (this.currentIndex >= this.sentence.length) {
          this.isCompleted = true;
          this.practiceCount++;
          this.$emit('completed');
        }
      }

      // 防止空白鍵捲動頁面
      if (event.key === ' ') {
        event.preventDefault();
      }
    },

    getCharClass(index) {
      if (index < this.currentIndex) {
        return 'char typed';
      }
      if (index === this.currentIndex) {
        return 'char current';
      }
      return 'char pending';
    },

    getKeyClass(key) {
      // 處理帶下劃線的鍵（f̲ 和 j̲）
      const cleanKey = key.replace('̲', '').toLowerCase();
      return cleanKey === this.currentChar ? 'highlight' : '';
    },

    toggleKeyboard() {
      this.showKeyboard = !this.showKeyboard;
    },

    restart() {
      this.currentIndex = 0;
      this.isCompleted = false;
    },

    resetState() {
      this.currentIndex = 0;
      this.isCompleted = false;
      // practiceCount 不重置，讓用戶看到總練習次數
    },
  },
};
</script>

<style scoped>
.typing-sentence {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 打字顯示區 */
.typing-display {
  font-family: 'Courier New', monospace;
  font-size: 1.4rem;
  line-height: 2;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 20px;
  min-height: 80px;
  word-wrap: break-word;
}

.char {
  transition: all 0.1s ease;
}

.char.typed {
  color: #27ae60;
}

.char.current {
  color: #3498db;
  background: #e3f2fd;
  padding: 2px 4px;
  border-radius: 3px;
  animation: blink 1s infinite;
}

.char.pending {
  color: #bdc3c7;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 控制列 */
.typing-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.practice-count {
  font-size: 1rem;
  color: #7f8c8d;
}

.control-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #ecf0f1;
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #bdc3c7;
}

/* 完成提示 */
.completed-msg {
  text-align: center;
  padding: 15px;
  background: #d5f4e6;
  color: #27ae60;
  border-radius: 6px;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

/* 鍵盤佈局 */
.keyboard-layout {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
}

.key {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.2s ease;
}

.key.highlight {
  background: #f39c12;
  color: white;
  border-color: #e67e22;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(243, 156, 18, 0.4);
}

/* 空白鍵 */
.keyboard-row:last-child .key {
  width: 250px;
}
</style>