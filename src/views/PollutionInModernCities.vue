<template>
  <section class="section section-lg text-center text-md-start bg-default">
    <div class="container">
      <div class="box-range-content">
        <router-link @click="transPage('/ListTry50')" to="/about-us"
          >back</router-link
        >
      </div>
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

      <div>
        <AudioPlayer audioSource="2.Pollution in modern cities.mp3" />
      </div>

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

      <div
        class="box-range-content"
        style="display: flex; gap: 10px; align-items: center; margin-top: 1rem"
      >
        <button @click="showCloze" style="padding: 5px">
          <i class="box-project-meta-icon linearicons-book"></i>
        </button>
        <button @click="closeCloze" style="padding: 5px">
          <i class="box-project-meta-icon linearicons-book2"></i>
        </button>
        <button @click="checkTypingPractice" style="padding: 5px">
          <i class="box-project-meta-icon linearicons-typewriter"></i>
        </button>
        <button @click="toggleChunkList" style="padding: 5px" title="顯示語塊">
          <i class="box-project-meta-icon linearicons-document"></i>
          Chunks ({{ chunkStore.chunks.length }})
        </button>
      </div>

      <div v-if="showClozeTest" class="row row-40 row-lg-50 explanation-text">
        <ClozeTest
          :dataText="dataText"
          :wordExplanations="wordExplanations"
          :wordCloze="wordCloze"
          :blanksCount="100"
        />
      </div>

      <!-- TypingPractice 元件 -->
      <div v-if="showTypingPractice" style="margin-top: 20px">
        <TypingPractice
          v-if="showTypingPractice"
          :key="typingWord"
          :text="typingWord"
          :showKeyboard="true"
          @close="showTypingPractice = false"
        />
      </div>

      <!-- Chunk 清單面板 -->
      <ChunkListPanel :visible="showChunkList" @close="showChunkList = false" />
    </div>
  </section>
</template>

<script>
import * as XLSX from "xlsx";
import { useExcelStore } from "@/stores/excelStore";
import { useChunkStore } from '@/stores/chunkStore';
import ClozeTest from "@/components/ClozeTest.vue";
import AudioPlayer from "@/components/AudioPlayer.vue";
import WordExplanation from "@/components/WordExplanation.vue";
import TypingPractice from "@/components/TypingPractice.vue";
import ChunkListPanel from "@/components/ChunkListPanel.vue";

export default {
  name: "PollutionInModernCities",
  components: {
    ClozeTest,
    AudioPlayer,
    WordExplanation,
    TypingPractice,
    ChunkListPanel,
  },
  data() {
    return {
      dataText:
        "Many cities face serious pollution problems due to traffic, industry, and waste. Smoke from cars and factories makes the air unhealthy, causing breathing issues. Rubbish in streets and rivers leads to dirty water and harms wildlife. Noise from vehicles and construction also affects people’s well-being. To improve the situation, public transport should be better, and recycling must increase. Green spaces can help clean the air and make cities more pleasant. Governments and individuals need to work together to reduce pollution. If people act now, cities will become healthier and safer for future generations. What solutions do you suggest?",
      showExplanation: false,
      showTranslation: false,
      wordExplanations: {},
      wordTranslations: {},
      wordExamples: {},
      wordPartsOfSpeech: {},
      wordCloze: {},
      selectedWord: "",
      explanationText: "",
      showClozeTest: false,
      typingWord: "",
      showTypingPractice: false,
      showChunkList: false, // 新增
      chunkStore: useChunkStore(), // 新增
    };
  },
  async created() {
    const excelStore = useExcelStore();
    // 假設您已經在 data() 中初始化了 chunkStore
    // this.chunkStore = useChunkStore();

    // --- 1. 載入單字 Excel (如果尚未載入) ---
    if (
      Object.keys(excelStore.wordExplanations).length === 0 ||
      Object.keys(excelStore.wordTranslations).length === 0
    ) {
      try {
        const url = process.env.BASE_URL + "excel/default.xlsx";
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        let allData = [];
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // 注意: 這裡的 XLSX 需確保已在全域或元件中引入
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          allData = allData.concat(jsonData);
        });
        if (allData.length > 0) {
          excelStore.setExcelData(Object.keys(allData[0]), allData);
        }
      } catch (error) {
        console.error("載入預設 Excel 失敗:", error);
      }
    }

    // --- 2. 載入這篇文章的 Chunks (新/修改的功能) ---
    // 這裡使用您範例中假設的 loadChunksExcel 方法
    try {
      await this.chunkStore.loadChunksExcel("pollution-chunks.xlsx");
    } catch (error) {
      console.error("載入語塊 Excel 失敗:", error);
    }

    // --- 3. 同步資料到元件 (單字和語塊) ---
    this.wordExplanations = excelStore.wordExplanations;
    this.wordTranslations = excelStore.wordTranslations;
    this.wordExamples = excelStore.wordExamples;
    this.wordPartsOfSpeech = excelStore.wordPartsOfSpeech;
    this.wordCloze = excelStore.wordCloze || {};

    // 假設 chunkStore 有一個 getter 叫 allChunks
    // 將載入的語塊同步到 extendedChunks data 屬性中
    // 備註: 您的原始範例中 extendedChunks 是寫死的，但實際應用中應從 Store 載入
    this.extendedChunks = this.chunkStore.allChunks["climate-change"] || {};
  },
  computed: {
    words() {
      const explanations = this.wordExplanations || {};
      const translations = this.wordTranslations || {};
      return this.dataText.split(/(\s+)/).map((word) => {
        const cleanedWord = word.replace(/[.,!?();:"“”]/g, "").toLowerCase();
        return {
          text: word,
          cleanText: cleanedWord,
          explanation: explanations[cleanedWord],
          translation: translations[cleanedWord],
        };
      });
    },
    currentExplanation() {
      if (
        this.showTranslation &&
        this.wordTranslations[this.selectedWord.toLowerCase()]
      ) {
        return this.wordTranslations[this.selectedWord.toLowerCase()];
      }
      return this.explanationText;
    },
  },
  methods: {
    handleWordClick(event) {
      const clickedWordElement = event.target.closest(".clickable-word");
      if (clickedWordElement) {
        const word = clickedWordElement.dataset.word.toLowerCase();
        const explanation = this.wordExplanations[word];
        const translation = this.wordTranslations[word];
        const example = this.wordExamples?.[word];

        if (explanation || translation || example) {
          this.selectedWord = word;
          this.explanationText = explanation || "";
          this.currentExample = example || "";
          this.showExplanation = true;
          this.showTranslation = false;

          this.typingWord = word;
        }
      } else {
        this.closeExplanation();
      }
    },
    closeExplanation() {
      this.showExplanation = false;
      this.showTranslation = false;
      this.selectedWord = "";
      this.explanationText = "";
      this.currentExample = "";
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
      console.log("this.showTypingPractice:", this.showTypingPractice);
      if (this.showTypingPractice) {
        this.showTypingPractice = false;
      } else {
        this.showTypingPractice = true;
      }
    },
    toggleChunkList() {
      this.showChunkList = !this.showChunkList;
    },
  },
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
.explanation-text p {
  margin-bottom: 1rem;
}
</style>
