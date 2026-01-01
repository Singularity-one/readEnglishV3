<template>
  <div class="sentence-audio-player">
    <!-- 播放 -->
    <button @click="speakSentence" class="control-btn">
      🔊 播放
    </button>

    <!-- 循環播放 -->
    <button @click="toggleLoop" class="control-btn" :class="{ active: isLoop }">
      🔁 循環
    </button>

    <!-- 停止 -->
    <button @click="stopSpeaking" class="control-btn">
      ⏹ 停止
    </button>

    <!-- 倍速播放 -->
    <button @click="cycleSpeed" class="control-btn" :class="{ active: speed !== 1 }">
      ⏩ {{ speed }}x
    </button>

    <!-- 雨聲背景 -->
    <button @click="toggleRainSound" class="control-btn" :class="{ active: isRainPlaying }">
      🌧 雨聲
    </button>
  </div>
</template>

<script>
export default {
  name: 'SentenceAudioPlayer',
  props: {
    sentence: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoop: false,
      speed: 1,
      isRainPlaying: false,
      audioCtx: null,
      backgroundGain: null,
      audioNodes: [],
    };
  },
  beforeUnmount() {
    this.cleanupRainSound();
    this.stopSpeaking();
  },
  methods: {
    // 播放短句
    speakSentence() {
      if (!this.sentence) return;

      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();

        const utterance = new SpeechSynthesisUtterance(this.sentence);
        utterance.lang = 'en-US';
        // rate 範圍 0.1 ~ 2，對應 speed: 1=0.8, 2=1.2, 3=1.8
        const rateMap = { 1: 0.8, 2: 1.2, 3: 1.8 };
        utterance.rate = rateMap[this.speed] || 0.8;

        const voices = synth.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) ||
                        voices.find(v => v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }

        // 循環模式
        if (this.isLoop) {
          utterance.onend = () => {
            if (this.isLoop) {
              setTimeout(() => this.speakSentence(), 500);
            }
          };
        }

        synth.speak(utterance);
      } else {
        alert('您的瀏覽器不支援語音合成功能。');
      }
    },

    // 切換循環播放
    toggleLoop() {
      this.isLoop = !this.isLoop;
      if (this.isLoop) {
        this.speakSentence();
      } else {
        window.speechSynthesis.cancel();
      }
    },

    // 停止播放
    stopSpeaking() {
      this.isLoop = false;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    },

    // 切換播放速度 (1 → 2 → 3 → 1)
    cycleSpeed() {
      this.speed = this.speed === 3 ? 1 : this.speed + 1;
    },

    // ===== 雨聲白噪音功能 =====
    toggleRainSound() {
      if (this.isRainPlaying) {
        this.cleanupRainSound();
      } else {
        this.startRainSound();
      }
    },

    cleanupRainSound() {
      this.audioNodes.forEach(node => {
        try {
          node.disconnect();
        } catch (e) {
          console.debug('Node already disconnected');
        }
      });
      this.audioNodes = [];

      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }

      this.backgroundGain = null;
      this.isRainPlaying = false;
    },

    startRainSound() {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.backgroundGain = this.audioCtx.createGain();
      this.backgroundGain.gain.value = 0.4;
      this.backgroundGain.connect(this.audioCtx.destination);

      this.createSteadyRain();
      this.createRainVariation();
      this.createRaindrops();

      this.isRainPlaying = true;
    },

    createWhiteNoise() {
      const bufferSize = 4096;
      const node = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);

      node.onaudioprocess = (e) => {
        const out = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          out[i] = Math.random() * 2 - 1;
        }
      };
      return node;
    },

    createSteadyRain() {
      const rain = this.createWhiteNoise();

      const hp = this.audioCtx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 800;

      const lp = this.audioCtx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 4000;

      const rainGain = this.audioCtx.createGain();
      rainGain.gain.value = 0.3;

      rain.connect(hp).connect(lp).connect(rainGain).connect(this.backgroundGain);
      this.audioNodes.push(rain, hp, lp, rainGain);
    },

    createRainVariation() {
      const rain = this.createWhiteNoise();

      const hp = this.audioCtx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1200;

      const lp = this.audioCtx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 5000;

      const variationGain = this.audioCtx.createGain();
      variationGain.gain.value = 0.15;

      const modulateRain = () => {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;

        const now = this.audioCtx.currentTime;
        const target = 0.1 + Math.random() * 0.2;
        const duration = 5 + Math.random() * 5;

        variationGain.gain.linearRampToValueAtTime(target, now + duration);
        setTimeout(modulateRain, duration * 1000);
      };
      modulateRain();

      rain.connect(hp).connect(lp).connect(variationGain).connect(this.backgroundGain);
      this.audioNodes.push(rain, hp, lp, variationGain);
    },

    createRaindrops() {
      const createDrop = () => {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;

        const dur = 0.05 + Math.random() * 0.1;
        const buffer = this.audioCtx.createBuffer(
          1,
          this.audioCtx.sampleRate * dur,
          this.audioCtx.sampleRate
        );
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / data.length * 10);
        }

        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;

        const hp = this.audioCtx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 2000;

        const dropGain = this.audioCtx.createGain();
        const volume = 0.05 + Math.random() * 0.1;
        dropGain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);

        source.connect(hp).connect(dropGain).connect(this.audioCtx.destination);
        source.start();

        const nextDrop = 0.1 + Math.random() * 0.4;
        setTimeout(createDrop, nextDrop * 1000);
      };
      createDrop();
    },
  },
};
</script>

<style scoped>
.sentence-audio-player {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
</style>