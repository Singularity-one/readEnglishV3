<template>
  <section class="section section-lg text-center text-md-start bg-default">
    <div class="container">
      
      <div class="box-range-content" style="margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin-bottom: 5px;">
          🎓 IELTS Extension: Climate Change
        </h2>
        <p style="color: #7f8c8d; font-size: 14px;">
          從基礎到雅思6分的進階學習
        </p>
        <router-link @click="transPage('/ListExtended')" to="/list">back</router-link>
      </div>
      
      <div class="tab-navigation">
        <button 
          @click="setActiveTab('reading')" 
          :class="{ active: activeTab === 'reading' }"
        >
          📖 進階閱讀
        </button>
        <button 
          @click="setActiveTab('cloze')" 
          :class="{ active: activeTab === 'cloze' }"
        >
          📝 克漏字練習
        </button>
        <button 
          @click="setActiveTab('speaking')" 
          :class="{ active: activeTab === 'speaking' }"
        >
          🗣️ 範例回答
        </button>
      </div>

      <div v-if="activeTab === 'reading'" class="tab-content">
        <h3 class="h4" style="margin-top: 1.5rem;">Climate Change: Solutions and Cooperation</h3>
        
        <div style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button @click="showChunks = !showChunks" style="padding: 10px 20px;">
            <i :class="showChunks ? 'linearicons-eye-crossed' : 'linearicons-eye'"></i> 
            {{ showChunks ? '隱藏語塊標註' : '顯示語塊標註' }}
          </button>
          <button @click="speakText(extendedText)" style="padding: 10px 20px;">
            🔊 朗讀文章
          </button>
        </div>

        <div class="reading-text-box">
          <p 
            v-for="(paragraph, idx) in extendedText.split('\n\n')" 
            :key="'p-' + idx" 
            style="margin-bottom: 15px;"
          >
            <span v-html="renderTextWithChunks(paragraph)"></span>
          </p>
        </div>
        
        <div style="margin-top: 2rem;">
          <AudioPlayer audioSource="2.SolutionsAndCooperation.mp3" />
        </div>
        
        <div class="key-chunks-list">
          <h4 style="margin-bottom: 15px;">💡 本文重點語塊 (Key Chunks)</h4>
          <div class="chunks-grid">
            <div 
              v-for="(data, chunk) in extendedChunks" 
              :key="chunk"
              @click="setSelectedChunk(chunk)"
              class="chunk-item"
            >
              <strong>{{ chunk }}</strong>
              <br />
              <span>{{ data.translation }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'cloze'" class="tab-content">
        <h3 class="h4" style="margin-top: 1.5rem;">📝 詞彙鞏固：克漏字填空</h3>
        <div class="cloze-instructions">
          <strong>💡 說明：</strong> 請填入文章的關鍵詞彙，有助鞏固雅思詞彙。
        </div>

        <ClozeTest 
          :dataText="extendedText"
          :wordExplanations="wordExplanations"
          :wordCloze="wordCloze"
          :blanksCount="100"
        />
      </div>

      <div v-if="activeTab === 'speaking'" class="tab-content">
        <h3 class="h4" style="margin-top: 1.5rem;">🗣️ 雅思口說 Part 2 範例</h3>
        
        <div class="speaking-topic-box">
          <h4 style="margin-bottom: 15px;">🎤 IELTS Speaking Part 2</h4>
          <p>
            <strong>Describe an environmental problem that you think is most important to solve.</strong>
            <br/>
            You should say: What the problem is, What causes this problem, How it affects the world, And what can be done to solve it.
          </p>
        </div>

        <div style="margin-bottom: 25px; display: flex; gap: 10px; justify-content: center;">
          <button @click="speakText(sampleAnswer.text)" style="padding: 15px 30px; background-color: #27ae60;">
            ▶ 播放範例回答
          </button>
          <button @click="startTypingPractice" style="padding: 15px 30px; background-color: #3498db;">
            ⌨️ 練習打字/背誦
          </button>
        </div>

        <div class="reading-text-box">
          <h4 style="margin-bottom: 20px;">📄 完整文字稿（含語塊標註）</h4>
          <p 
            v-for="(paragraph, idx) in sampleAnswer.text.split('\n\n')" 
            :key="'sa-p-' + idx" 
            style="margin-bottom: 15px;"
          >
            <span v-html="renderTextWithChunks(paragraph, sampleAnswer.chunks)"></span>
          </p>
        </div>
        
        <div class="key-chunks-list speech-chunks">
          <h4 style="margin-bottom: 15px;">⭐ 口說常用語塊</h4>
          <div class="chunks-grid">
            <div 
              v-for="(translation, chunk) in sampleAnswer.chunks" 
              :key="chunk" 
              class="chunk-item speech-item"
            >
              <strong>{{ chunk }}</strong>
              <br />
              <span>{{ translation }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <WordExplanation
        :visible="!!selectedChunk"
        :word="selectedChunk"
        :partOfSpeech="extendedChunks[selectedChunk]?.type || (sampleAnswer.chunks[selectedChunk] ? 'Phrase' : '')"
        :explanation="extendedChunks[selectedChunk]?.explanation || sampleAnswer.chunks[selectedChunk] || ''"
        :translation="extendedChunks[selectedChunk]?.translation || sampleAnswer.chunks[selectedChunk] || ''"
        :example="extendedChunks[selectedChunk]?.example || ''"
        @close="selectedChunk = null"
      />

      <TypingPractice 
        v-if="showTypingPractice"
        :key="'typing-' + typingTextKey"
        :text="typingText"
        :showKeyboard="true"
        @close="showTypingPractice = false"
      />
      
    </div>
  </section>
</template>

<script>
import AudioPlayer from "@/components/AudioPlayer.vue";
import ClozeTest from '@/components/ClozeTest.vue';
import WordExplanation from '@/components/WordExplanation.vue';
import TypingPractice from '@/components/TypingPractice.vue';

export default {
  name: 'ClimateChangeExtended',
  components: { AudioPlayer, ClozeTest, WordExplanation, TypingPractice },

  props: {
    wordExplanations: { type: Object, default: () => ({}) },
    wordCloze: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      activeTab: 'reading',
      selectedChunk: null, 
      showChunks: true, 
      showTypingPractice: false,
      typingText: '',
      typingTextKey: 0,

      extendedText:
        "Global action is imperative to mitigate the severe consequences of climate change. The central goal for nations worldwide is the transition to a low-carbon economy. This necessitates a drastic reduction in greenhouse gas emissions, primarily through investing in and adopting renewable energy sources like solar, wind, and geothermal power. Furthermore, carbon pricing mechanisms, such as taxes or trading schemes, can provide a significant economic incentive for industries to pollute less.\n\n" +
        "Effective response also relies heavily on international cooperation. Agreements like the Paris Accord emphasize the need for developed countries to provide financial assistance and technological transfer to developing nations, enabling them to pursue sustainable development. This shared responsibility acknowledges that the climate crisis is a transnational issue, demanding coordinated policy implementation.\n\n" +
        "Beyond governmental policy, individual behavior plays an essential role. Citizens can contribute to climate resilience by reducing their consumption, choosing energy-efficient transport, and advocating for environmental protection. Education is key: raising public awareness about environmental issues empowers communities to make informed and responsible choices. Ultimately, a successful long-term strategy requires a paradigm shift in how we view economic growth and environmental stewardship.",

      extendedChunks: {
        "imperative to": { translation: "必須要...", type: "Phrase", explanation: "Extremely important or urgent to do something." },
        "mitigate the severe consequences": { translation: "減輕嚴重後果", type: "Collocation" },
        "low-carbon economy": { translation: "低碳經濟", type: "Noun Phrase" },
        "drastic reduction": { translation: "劇烈減少", type: "Collocation" },
        "renewable energy sources": { translation: "可再生能源", type: "Noun Phrase" },
        "carbon pricing mechanisms": { translation: "碳定價機制", type: "Noun Phrase" },
        "economic incentive": { translation: "經濟誘因", type: "Collocation" },
        "international cooperation": { translation: "國際合作", type: "Noun Phrase" },
        "financial assistance": { translation: "資金援助", type: "Noun Phrase" },
        "transnational issue": { translation: "跨國議題", type: "Noun Phrase" },
        "paradigm shift": { translation: "典範轉移", type: "High-level Noun Phrase", example: "The crisis requires a fundamental paradigm shift in consumer habits." },
        "environmental stewardship": { translation: "環境管理 / 監管", type: "Noun Phrase" },
      },

      sampleAnswer: {
        text:
          "Well, I'd like to talk about air pollution, which is a serious environmental problem in my country, particularly in urban areas.\n\n" +
          "The main cause of this problem is vehicle emissions. With rapid economic development, more and more people can afford cars, leading to heavy traffic congestion in major cities. Additionally, many factories release pollutants into the atmosphere without proper filtration systems.\n\n" +
          "This issue affects people's lives in several ways. Firstly, poor air quality leads to respiratory problems, especially among children and the elderly. I've noticed that on heavily polluted days, many people wear face masks when going outside. Secondly, it reduces visibility, making driving dangerous and affecting tourism.\n\n" +
          "As for solutions, I believe a combination of approaches is necessary. The government should invest more in public transportation to reduce private car usage. Stricter regulations on factory emissions are also essential. On an individual level, people can choose to walk or cycle for short distances rather than driving. If these measures are implemented effectively, I'm confident we can improve the situation significantly.",

        chunks: {
          "I'd like to talk about": "我想談談...",
          "particularly in": "特別是在...",
          "The main cause of": "主要原因是...",
          "leads to": "導致...",
          "in several ways": "在多方面",
          "respiratory problems": "呼吸問題",
          "I've noticed that": "我注意到...",
          "As for solutions": "至於解決方案",
          "a combination of approaches": "結合多種方法",
          "Stricter regulations": "更嚴格的規範",
          "On an individual level": "在個人層面",
          "I'm confident we can": "我相信我們能...",
        },
      },
    };
  },

  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },

    transPage(item) {
      if (this.$router) {
        this.$router.push(item);
      }
    },

    speakText(text) {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'en-US';
        utter.rate = 0.9;

        const voices = synth.getVoices();
        const en = voices.find(v => v.lang.startsWith('en-') && v.default) ||
                   voices.find(v => v.lang.startsWith('en'));

        if (en) {
          utter.voice = en;
          utter.lang = en.lang;
        }

        synth.speak(utter);
      } else {
        alert('您的瀏覽器不支持語音合成功能。');
      }
    },

    startTypingPractice() {
      this.typingText = this.sampleAnswer.text;
      this.typingTextKey++;
      this.showTypingPractice = true;
    },

    setSelectedChunk(chunk) {
      this.selectedChunk = chunk;
      this.typingText = chunk;
      this.typingTextKey++;
      this.showTypingPractice = true;
    },

    handleChunkClick(event) {
      const chunk = event.target.dataset.chunk;
      if (chunk) {
        this.selectedChunk = chunk;
        this.typingText = chunk;
        this.typingTextKey++;
        this.showTypingPractice = true;
      }
    },

    renderTextWithChunks(text, chunkDict = this.extendedChunks) {
      if (!this.showChunks) return text;

      let html = text;

      const sorted = Object.keys(chunkDict).sort((a, b) => b.length - a.length);

      sorted.forEach(chunk => {
        const reg = new RegExp(
          `(${chunk.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`,
          'gi'
        );

        const replaced =
          `<span data-chunk="${chunk}" class="chunk-highlight" ` +
          `style="cursor:pointer;padding:2px 4px;border-bottom:2px solid #2196f3;` +
          `background-color:#e3f2fd;border-radius:3px;">$1</span>`;

        html = html.replace(reg, replaced);
      });

      return html;
    },
  },

  mounted() {
    this.$el.addEventListener('click', this.handleChunkClick);
  },

  beforeUnmount() {
    this.$el.removeEventListener('click', this.handleChunkClick);
  },
};
</script>

<style scoped>
/* 選項卡樣式 */
.tab-navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
}
.tab-navigation button {
  padding: 12px 24px;
  background-color: #ecf0f1;
  color: #7f8c8d;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}
.tab-navigation button.active {
  background-color: #3498db;
  color: white;
}
.tab-content {
    padding: 20px 0;
}
/* 閱讀/文字稿區塊樣式 */
.reading-text-box {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    line-height: 1.8;
    font-size: 16px;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    text-align: justify;
}
/* 語塊列表樣式 */
.key-chunks-list {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}
.chunks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
}
.chunk-item {
    padding: 10px;
    background-color: #e3f2fd;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
    text-align: left;
}
.chunk-item:hover {
    background-color: #bbdefb;
}

/* 口說專用樣式 */
.speaking-topic-box {
    background-color: #e8f5e9;
    border: 2px solid #4caf50;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
    text-align: left;
}
.speech-chunks {
    background-color: #fff9e6;
}
.speech-item {
    background-color: #fff3cd;
    border-left: 3px solid #ffc107;
}

/* 克漏字說明 */
.cloze-instructions {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 25px;
    font-size: 14px;
    text-align: left;
}
</style>