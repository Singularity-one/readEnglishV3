<template>
  <section class="section section-lg text-center text-md-start bg-default">
    <div class="container">
      <div class="box-range-content">
        <router-link @click="transPage('/ListTry50')" to="/about-us">back</router-link>
      </div>  

      <!-- 短文 -->
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
      <div>
        <AudioPlayer audioSource="1.Climate change and its impact.mp3" />
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
import AudioPlayer from "@/components/AudioPlayer.vue";
import WordExplanation from '@/components/WordExplanation.vue';
import TypingPractice from '@/components/TypingPractice.vue';
import ChunkListPanel from '@/components/ChunkListPanel.vue';

export default {
  name: 'ClimateChangeAndItsImpact',
  components: { 
    ClozeTest, 
    AudioPlayer, 
    WordExplanation, 
    TypingPractice, 
    ChunkListPanel 
  },
  data() {
    return {
      dataText: 'Climate change is a serious problem affecting the world. Rising temperatures cause extreme weather, such as storms, droughts, and floods. Ice in the polar regions is melting, leading to higher sea levels that threaten coastal areas. Many animals lose their homes as forests disappear. People also face health risks due to heat and poor air quality. To reduce climate change, countries must cut pollution and use clean energy. Individuals can help by saving electricity and planting trees. If action is not taken soon, future generations will suffer. What do you think is the most effective way to fight climate change?',
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
    // 載入單字 Excel (原有功能)
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

    // 載入這篇文章的 Chunks (新功能)
    await this.chunkStore.loadChunksExcel('climate-change-chunks.xlsx');
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