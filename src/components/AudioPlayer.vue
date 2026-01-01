<template>
  <div
    class="box-range-content"
    style="display: flex; gap: 10px; align-items: center"
  >
    <!-- 播放 -->
    <button @click="playAudio">
      <i class="box-project-meta-icon linearicons-play-circle"></i>
    </button>

    <!-- 循環播放 -->
    <button @click="toggleLoop">
      <i
        :class="[
          'box-project-meta-icon',
          'linearicons-repeat',
          { active: isLoop },
        ]"
      ></i>
    </button>

    <!-- 停止 -->
    <button @click="stopAudio">
      <i class="box-project-meta-icon linearicons-stop-circle"></i>
    </button>

    <!-- 倍速播放 -->
    <button
      @click="cycleSpeed"
      style="display: flex; align-items: center; gap: 5px"
    >
      <i
        :class="[
          'box-project-meta-icon',
          'linearicons-forward-circle',
          { active: speed > 1 },
        ]"
      ></i>
      <span style="margin-left: 1px">{{ speed }}x</span>
    </button>

    <!-- 雨聲背景 -->
    <button @click="toggleRainSound">
      <i
        :class="[
          'box-project-meta-icon',
          'linearicons-cloud-rain',
          { active: isRainPlaying },
        ]"
      ></i>
    </button>

    <!-- 音訊 -->
    <audio ref="audioPlayer" :src="resolvedAudioSource"></audio>
  </div>
</template>

<script>
export default {
  name: "AudioPlayer",
  props: {
    audioSource: { type: String, required: true },
  },
  data() {
    return {
      isLoop: false,
      resolvedAudioSource: "",
      speed: 1,
      audioCtx: null,
      backgroundGain: null,
      isRainPlaying: false,
      audioNodes: [],
    };
  },
  mounted() {
    try {
      this.resolvedAudioSource = require(`@/mp3/${this.audioSource}`);
    } catch (error) {
      console.error(`找不到音訊檔案: src/mp3/${this.audioSource}`, error);
    }
  },
  beforeUnmount() {
    this.cleanupRainSound();
  },
  methods: {
    playAudio() {
      this.$refs.audioPlayer?.play();
    },

    toggleLoop() {
      const player = this.$refs.audioPlayer;
      this.isLoop = !this.isLoop;
      player.loop = this.isLoop;
      player.play();
    },

    stopAudio() {
      const audio = this.$refs.audioPlayer;
      audio.pause();
      audio.currentTime = 0;
    },

    cycleSpeed() {
      const player = this.$refs.audioPlayer;
      this.speed = this.speed === 3 ? 1 : this.speed + 1;
      player.playbackRate = this.speed;
      player.play();
    },

    // ===== 雨聲背景音功能 =====
    
    toggleRainSound() {
      if (this.isRainPlaying) {
        this.cleanupRainSound();
      } else {
        this.startRainSound();
      }
    },

    cleanupRainSound() {
      // 清理所有音訊節點
      this.audioNodes.forEach(node => {
        try {
          node.disconnect();
        } catch (e) {
          // 忽略已經斷開的節點錯誤
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

      // 創建多層雨聲
      this.createSteadyRain(); // 持續穩定雨聲
      this.createRainVariation(); // 雨勢變化
      this.createRaindrops(); // 隨機雨滴聲

      this.isRainPlaying = true;
    },

    // White noise generator (for rain sound)
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

    // 持續穩定雨聲（主要背景層）
    createSteadyRain() {
      const rain = this.createWhiteNoise();
      
      // 高通濾波器 - 去除低頻，保留雨聲的高頻特性
      const hp = this.audioCtx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 800;
      
      // 低通濾波器 - 去除過高頻率，使聲音更柔和
      const lp = this.audioCtx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 4000;
      
      const rainGain = this.audioCtx.createGain();
      rainGain.gain.value = 0.3;
      
      rain.connect(hp).connect(lp).connect(rainGain).connect(this.backgroundGain);
      this.audioNodes.push(rain, hp, lp, rainGain);
    },

    // 雨勢變化（模擬雨量大小變化）
    createRainVariation() {
      const rain = this.createWhiteNoise();
      
      const hp = this.audioCtx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1200;
      
      const lp = this.audioCtx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 5000;
      
      const variationGain = this.audioCtx.createGain();
      variationGain.gain.value = 0.15;
      
      // 模擬雨勢變化（5-10秒週期）
      const modulateRain = () => {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;
        
        const now = this.audioCtx.currentTime;
        const target = 0.1 + Math.random() * 0.2; // 0.1-0.3 之間
        const duration = 5 + Math.random() * 5; // 5-10秒
        
        variationGain.gain.linearRampToValueAtTime(target, now + duration);
        setTimeout(modulateRain, duration * 1000);
      };
      modulateRain();
      
      rain.connect(hp).connect(lp).connect(variationGain).connect(this.backgroundGain);
      this.audioNodes.push(rain, hp, lp, variationGain);
    },

    // 隨機雨滴聲（較近的雨滴打在物體上）
    createRaindrops() {
      const createDrop = () => {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;
        
        const dur = 0.05 + Math.random() * 0.1; // 50-150ms
        const buffer = this.audioCtx.createBuffer(
          1,
          this.audioCtx.sampleRate * dur,
          this.audioCtx.sampleRate
        );
        const data = buffer.getChannelData(0);
        
        // 短促的爆裂噪音
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / data.length * 10);
        }
        
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        
        // 高通濾波 - 雨滴的清脆感
        const hp = this.audioCtx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 2000;
        
        const dropGain = this.audioCtx.createGain();
        const volume = 0.05 + Math.random() * 0.1;
        dropGain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
        
        source.connect(hp).connect(dropGain).connect(this.audioCtx.destination);
        source.start();
        
        // 隨機間隔產生下一個雨滴
        const nextDrop = 0.1 + Math.random() * 0.4; // 100-500ms
        setTimeout(createDrop, nextDrop * 1000);
      };
      createDrop();
    },
  },
};
</script>

<style scoped>
.active {
  color: #e74c3c;
  font-weight: bold;
}
</style>