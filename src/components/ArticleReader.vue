<template>
  <section class="section section-lg text-center text-md-start bg-default">
    <div class="container">
      <!-- 返回按鈕 -->
      <div class="box-range-content">
        <router-link @click="transPage('/ListTry50')" to="/ListTry50">back</router-link>
      </div>

      <!-- 文章標題 (可選) -->
      <h2 v-if="articleConfig" style="margin-bottom: 1rem;">{{ articleConfig.title }}</h2>

      <!-- 短文內容 -->
      <p class="text-spacing-sm" @click="handleWordClick">
        <span
          v-for="(word, index) in words"
          :key="index"
          :class="{ 'clickable-word': word.explanation }"
          :data-word="word.cleanText"
        >
          {{ word.text }}
        </span>
      </p>

      <!-- AudioPlayer -->
      <div v-if="articleConfig">
        <AudioPlayer :audioSource="articleConfig.audioFile" />
      </div>

      <!-- WordExplanation -->
      <div>
        <WordExplanation
          :visible="showExplanation"
          :word="selectedWord"
          :partOfSpeech="wordPartsOfSpeech[selectedWord]"
          :explanation="wordExplanations[selectedWord]"
          :translation="wordTranslations[selectedWord]"
          :example="wordExamples[selectedWord]"
          @close="showExplanation = false"
        />
      </div>

      <!-- 控制按鈕 -->
      <div class="box-range-content" style="display: flex; gap: 10px; align-items: center; margin-top: 1rem;">
        <button @click="showCloze" style="padding: 5px;" title="克漏字練習">
          <i class="box-project-meta-icon linearicons-book"></i>
        </button>
        <button @click="closeCloze" style="padding: 5px;" title="關閉克漏字">
          <i class="box-project-meta-icon linearicons-book2"></i>
        </button>
        <button @click="checkTypingPractice" style="padding: 5px;" title="打字練習">
          <i class="box-project-meta-icon linearicons-typewriter"></i>
        </button>
        <button @click="toggleChunkList" style="padding: 5px;" title="顯示語塊">
          <i class="box-project-meta-icon linearicons-document"></i>
          Chunks ({{ chunkStore.chunks.length }})
        </button>
      </div>

      <!-- ClozeTest 元件 -->
      <div v-if="showClozeTest" class="row row-40 row-lg-50 explanation-text">
        <ClozeTest
          :dataText="dataText"
          :wordExplanations="wordExplanations"
          :wordCloze="wordCloze"
          :blanksCount="100"
        />
      </div>

      <!-- TypingPractice 元件 -->
      <TypingPractice
        v-if="showTypingPractice"
        :key="typingWord"
        :text="typingWord"
        :showKeyboard="true"
        @close="showTypingPractice = false"
      />

      <!-- Chunk 清單面板 -->
      <ChunkListPanel
        :visible="showChunkList"
        @close="showChunkList = false"
      />
    </div>
  </section>
</template>

<script>
import * as XLSX from 'xlsx';
import { useExcelStore } from '@/stores/excelStore';
import { useChunkStore } from '@/stores/chunkStore';
import ClozeTest from '@/components/ClozeTest.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import WordExplanation from '@/components/WordExplanation.vue';
import TypingPractice from '@/components/TypingPractice.vue';
import ChunkListPanel from '@/components/ChunkListPanel.vue';

export default {
  name: 'ArticleReader',
  components: {
    ClozeTest,
    AudioPlayer,
    WordExplanation,
    TypingPractice,
    ChunkListPanel
  },
  props: {
    // 從父元件 (ArticlePage) 接收文章配置
    articleConfig: {
      type: Object,
      required: true,
      validator: (value) => {
        // 驗證必要的屬性
        return value.text && value.audioFile && value.chunksFile;
      }
    }
  },
  data() {
    return {
      dataText: '',            // 文章內容
      showExplanation: false,
      selectedWord: '',
      wordExplanations: {},
      wordTranslations: {},
      wordExamples: {},
      wordPartsOfSpeech: {},
      wordCloze: {},
      showClozeTest: false,
      typingWord: '',
      showTypingPractice: false,
      showChunkList: false,
      chunkStore: useChunkStore(),
    };
  },
  async created() {
    // 從 props 設置文章內容
    this.dataText = this.articleConfig.text;

    // 載入單字 Excel (如果尚未載入)
    const excelStore = useExcelStore();
    if (Object.keys(excelStore.wordExplanations).length === 0) {
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
          excelStore.setExcelData(Object.keys(allData[0]), allData);
        }
      } catch (error) {
        console.error('載入預設 Excel 失敗:', error);
      }
    }

    // 同步單字資料
    this.wordExplanations = excelStore.wordExplanations;
    this.wordTranslations = excelStore.wordTranslations;
    this.wordExamples = excelStore.wordExamples;
    this.wordPartsOfSpeech = excelStore.wordPartsOfSpeech;
    this.wordCloze = excelStore.wordCloze || {};

    // 載入這篇文章的 Chunks
    if (this.articleConfig.chunksFile) {
      try {
        await this.chunkStore.loadChunksExcel(this.articleConfig.chunksFile);
      } catch (error) {
        console.warn('載入 Chunks 失敗 (可能檔案尚未建立):', error);
        // 不影響主要功能,只是 chunks 功能暫時無法使用
      }
    }
  },
  computed: {
    words() {
      const explanations = this.wordExplanations || {};
      const translations = this.wordTranslations || {};
      return this.dataText.split(/(\s+)/).map(word => {
        const cleanedWord = word.replace(/[.,!?();:"""]/g, '').toLowerCase();
        return {
          text: word,
          cleanText: cleanedWord,
          explanation: explanations[cleanedWord],
          translation: translations[cleanedWord],
        };
      });
    }
  },
  methods: {
    handleWordClick(event) {
      const clickedWordElement = event.target.closest('.clickable-word');
      if (clickedWordElement) {
        const word = clickedWordElement.dataset.word.toLowerCase();
        const explanation = this.wordExplanations[word];
        const translation = this.wordTranslations[word];
        const example = this.wordExamples?.[word];

        if (explanation || translation || example) {
          this.selectedWord = word;
          this.showExplanation = true;
          this.typingWord = word;
        }
      } else {
        this.closeExplanation();
      }
    },
    closeExplanation() {
      this.showExplanation = false;
      this.selectedWord = '';
    },
    showCloze() {
      this.showClozeTest = true;
    },
    closeCloze() {
      this.showClozeTest = false;
    },
    transPage(item) {
      this.$router.push(`${item}`);
    },
    checkTypingPractice() {
      this.showTypingPractice = !this.showTypingPractice;
    },
    toggleChunkList() {
      this.showChunkList = !this.showChunkList;
    }
  }
};
</script>

<style scoped>
.clickable-word {
  cursor: pointer;
  border-bottom: 1px dotted #007bff;
  color: #007bff;
}
.clickable-word:hover {
  background-color: #f0f8ff;
}
</style>