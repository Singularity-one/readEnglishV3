<template>
  <div class="cloze-test-section" style="margin-top: 2rem;">
    <div 
      v-for="(sentence, sIndex) in sentencesTokens" 
      :key="'sentence-' + sIndex"
      style="margin-bottom: 1.5rem;"
    >
      <p v-if="!hiddenParts[sIndex]">
        <span v-for="(token, tIndex) in sentence" :key="'token-' + sIndex + '-' + tIndex">
          <template v-if="token.isBlank">
            <input
              type="text"
              v-model="token.userAnswer"
              :class="{'correct': token.isCorrect === true, 'wrong': token.isCorrect === false}"
              style="width: 100px; margin-right: 4px;"
              @keyup.enter="checkAnswers(sIndex)"
              placeholder="Type here"
            />
          </template>
          <template v-else>
            {{ token.text }}
          </template>
          <span> </span>
        </span>
      </p>

      <button @click="checkAnswers(sIndex)" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-file-check"></i>
      </button>
      <button @click="resetCloze(sIndex)" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-reply"></i>
      </button>
      <button @click="speakSentence(sIndex)" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-volume-medium"></i>
      </button>

      <button v-if="!hiddenParts[sIndex]" @click="hiddenParts[sIndex] = true" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-eye-crossed"></i>
      </button>
      <button v-else @click="hiddenParts[sIndex] = false" style="padding: 5px;">
        <i class="box-project-meta-icon linearicons-eye"></i>
      </button>

      <div v-if="showAnswers[sIndex]" style="margin-top: 1rem;">
        <p><strong>Correct answers:</strong></p>
        <ul>
          <li v-for="(token, index) in sentencesTokens[sIndex].filter(t => t.isBlank)" :key="'answer-'+sIndex+'-'+index">
            {{ token.correctAnswer }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClozeTest',
  props: {
    dataText: { type: String, required: true },
    wordExplanations: { type: Object, required: true },
    wordCloze: { type: Object, required: false, default: () => ({}) }, // 新增 props
    blanksCount: { type: Number, default: 3 }
  },
  data() {
    return {
      sentencesTokens: [],
      showAnswers: [],
      hiddenParts: [],
    };
  },
  methods: {
    splitIntoSentences(text) {
      return text.match(/[^.!?]+[.!?]?/g) || [];
    },
    generateClozeTokensForSentence(sentence) {
      const words = sentence.split(/(\s+)/);
      const candidateWords = Object.keys(this.wordExplanations || {});
      let blanksSet = new Set();

      words.forEach(word => {
        const cleaned = word.replace(/[.,!?();:"“”]/g, '').toLowerCase();
        const clozeValue = this.wordCloze?.[cleaned]; // 使用 props
        if (candidateWords.includes(cleaned) && clozeValue !== 'N') {
          blanksSet.add(cleaned);
        }
      });

      const blanksArray = Array.from(blanksSet).slice(0, this.blanksCount);

      return words.map(word => {
        const cleaned = word.replace(/[.,!?();:"“”]/g, '').toLowerCase();
        if (blanksArray.includes(cleaned)) {
          return {
            text: '_____',
            isBlank: true,
            correctAnswer: cleaned,
            userAnswer: '',
            isCorrect: null
          };
        }
        return { text: word, isBlank: false };
      });
    },
    generateClozeTokens() {
      const sentences = this.splitIntoSentences(this.dataText);
      this.sentencesTokens = sentences.map(sentence => this.generateClozeTokensForSentence(sentence));
      this.showAnswers = sentences.map(() => false);
      this.hiddenParts = sentences.map(() => false);
    },
    checkAnswers(sentenceIndex) {
      this.sentencesTokens[sentenceIndex].forEach(token => {
        if (token.isBlank) {
          token.isCorrect = token.userAnswer.trim().toLowerCase() === token.correctAnswer;
        }
      });
      this.showAnswers[sentenceIndex] = true;
    },
    resetCloze(sentenceIndex) {
      this.sentencesTokens[sentenceIndex].forEach(token => {
        if (token.isBlank) {
          token.userAnswer = '';
          token.isCorrect = null;
        }
      });
      this.showAnswers[sentenceIndex] = false;
    },
    speakSentence(sentenceIndex) {
      const sentenceTokens = this.sentencesTokens[sentenceIndex];
      const textToSpeak = sentenceTokens.map(t => t.isBlank ? t.correctAnswer : t.text).join('');

      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        const setGoogleVoice = () => {
          const voices = synth.getVoices();
          const googleVoice = voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en'));
          if (googleVoice) {
            utterance.voice = googleVoice;
          } else {
            const defaultEnglishVoice = voices.find(voice => voice.lang.startsWith('en'));
            if (defaultEnglishVoice) utterance.voice = defaultEnglishVoice;
          }
          synth.speak(utterance);
        };
        if (synth.getVoices().length > 0) {
          setGoogleVoice();
        } else {
          synth.onvoiceschanged = () => {
            setGoogleVoice();
            synth.onvoiceschanged = null;
          };
        }
      } else {
        alert('您的瀏覽器不支持語音合成功能。');
      }
    },
  },
  watch: {
    dataText: 'generateClozeTokens',
    wordExplanations: {
      handler: 'generateClozeTokens',
      deep: true
    },
    wordCloze: {
      handler: 'generateClozeTokens',
      deep: true
    }
  },
  created() {
    this.generateClozeTokens();
  }
};
</script>

<style scoped>
input.correct {
  border: 2px solid green;
  background-color: #d4edda;
}
input.wrong {
  border: 2px solid red;
  background-color: #f8d7da;
}
</style>