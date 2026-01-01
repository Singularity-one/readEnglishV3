<template>
  <div class="typing-practice">
    
    <div class="top-bar">
      <div class="practice-count">Practice times: {{ practiceCount }}</div>
      <div class="top-buttons">
        <button @click="toggleHelp" class="btn btn-warning">
          {{ isKeyboardVisible ? 'Close Help' : 'Show Help' }}
        </button>
        <button @click="$emit('close')" class="btn btn-danger">Close</button>
      </div>
    </div>

    <!-- 練習文字顯示 -->
    <div class="text-display">
      <span
        v-for="(char, index) in practiceText"
        :key="index"
        :class="getCharClass(index)"
      >
        {{ char === ' ' ? '␣' : char }}
      </span>
    </div>

    <!-- 鍵盤圖示 (可選) -->
    <div v-if="isKeyboardVisible" class="keyboard-layout">
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
  name: "TypingPractice",
  props: {
    text: {
      type: String,
      default: "The quick brown fox jumps over the lazy dog",
    },
    showKeyboard: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      practiceText: "",
      currentIndex: 0,
      finished: false,
      practiceCount: 0,
      isKeyboardVisible: this.showKeyboard, // 用 data 控制顯示
      keyboardRows: [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f̲", "g", "h", "j̲", "k", "l", ";"],
        ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
        [" "],
      ],
    };
  },
  watch: {
    text(newVal) {
      if (newVal && newVal.trim() !== "") {
        this.practiceText = newVal;
        this.practiceCount = 0;
        this.restart();
      }
    },
    showKeyboard(newVal) {
      this.isKeyboardVisible = newVal;
    }
  },
  computed: {
    currentChar() {
      return this.practiceText[this.currentIndex]?.toLowerCase() || "";
    },
  },
  mounted() {
    this.practiceText = this.text;
    window.addEventListener("keydown", this.handleKeyInput);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyInput);
  },
  methods: {
    toggleHelp() {
      this.isKeyboardVisible = !this.isKeyboardVisible;
    },
    handleKeyInput(event) {
      if (this.finished) {
        if (event.code === "Space") {
          event.preventDefault();
          this.restart();
        }
        return;
      }

      const key = event.key.toLowerCase();
      const expected = this.currentChar.toLowerCase();

      if (key === expected) {
        this.currentIndex++;
        if (this.currentIndex >= this.practiceText.length) {
          this.finished = true;
        }
      }
    },
    restart() {
      this.currentIndex = 0;
      this.finished = false;
      this.practiceCount++;
    },
    getCharClass(index) {
      if (index < this.currentIndex) return "char typed correct";
      if (index === this.currentIndex) return "char current";
      return "char pending";
    },
    getKeyClass(key) {
      return key.toLowerCase() === this.currentChar ? "highlight" : "";
    },
  },
};
</script>

<style scoped>
.typing-practice {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* 文字顯示區 */
.text-display {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  font-size: 28px;
  line-height: 1.8;
  font-family: "Courier New", monospace;
  letter-spacing: 2px;
  margin-bottom: 20px;
  min-height: 120px;
  border: 1px solid #ddd;
}

.char {
  transition: all 0.2s ease;
}

.char.typed.correct {
  color: #27ae60;
  font-weight: bold;
}

.char.current {
  color: #3498db;
  background: #e3f2fd;
  padding: 2px 5px;
  border-radius: 4px;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.char.pending {
  color: #95a5a6;
}

/* 控制按鈕 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

/* 鍵盤佈局 */
.keyboard-layout {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  border: 1px solid #ddd;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
}

.key {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ecf0f1;
  border: 2px solid #bdc3c7;
  border-radius: 5px;
  font-family: "Courier New", monospace;
  font-weight: bold;
  font-size: 18px;
  color: #34495e;
  transition: all 0.2s ease;
}

.key.highlight {
  background: #f39c12;
  color: white;
  border-color: #e67e22;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(243, 156, 18, 0.5);
}

.keyboard-row:last-child .key {
  width: 300px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.practice-count {
  font-size: 18px;
  font-weight: 600;
  color: #555;
}

.top-buttons {
  display: flex;
  gap: 10px;
}
</style>