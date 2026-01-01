<template>
  <div v-if="visible" class="explanation-text">
    <div style="display: flex; gap: 5px; align-items: center;">
      <p>
        <strong>{{ word }}</strong>
        <em>({{ partOfSpeech }})</em>
      </p>
      <button @click="speakWord" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-volume-medium"></i>
      </button>
      <button @click="toggleTranslation" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-eye"></i>
      </button>
      <button @click="closeExplanation" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-power-switch"></i>
      </button>
    </div>
    <p class="small-paragraph">{{ displayedExplanation }}</p>
    <p v-if="example" class="small-paragraph">
      <strong>example：</strong>{{ example }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'WordExplanation',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
    partOfSpeech: {
      type: String,
      default: '',
    },
    explanation: {
      type: String,
      default: '',
    },
    translation: {
      type: String,
      default: '',
    },
    example: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showTranslation: false,
    };
  },
  computed: {
    displayedExplanation() {
      return this.showTranslation && this.translation ? this.translation : this.explanation;
    },
  },
  methods: {
    closeExplanation() {
      this.showTranslation = false;
      this.$emit('close');
    },
    toggleTranslation() {
      this.showTranslation = !this.showTranslation;
    },
    speakWord() {
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(this.word);
        
        utterance.lang = 'en-US'; // 或 'en-GB'
        utterance.rate = 0.9;     // 語速 (0.1 ~ 10)
        utterance.pitch = 1;      // 音調 (0 ~ 2)
        utterance.volume = 1;     // 音量 (0 ~ 1)
        
        let voices = synth.getVoices();
        if (voices.length === 0) {// 如果第一次呼叫時 voices 還沒載入，等載入後再重試
          synth.onvoiceschanged = () => this.speakWord();
          return;
        }
        const enVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
        synth.speak(utterance);
      } else {
        alert('您的瀏覽器不支持語音合成功能。');
      }
    },
  },
};
</script>

<style scoped>
.explanation-text p {
  margin-bottom: 1rem;
}
</style>
