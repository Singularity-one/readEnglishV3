<template>
  <div id="app" class="app-container">
    <h1>One</h1>
    <!-- 按鈕，點擊後移除已翻過的卡片 -->
    <button @click="transPage('/')">回上一頁</button>
    <button @click="removeFlippedCards">Remove Flipped Cards</button>
    <div class="flashcard-container">
      <div
        v-for="(card, index) in flashcards"
        :key="index"
        class="flashcard"
        :class="{ flipped: card.isFlipped }"
        @click="flipCard(index)"
      >
        <div class="front" v-if="!card.isFlipped">
          {{ card.word }}
        </div>
        <div class="back" v-else>
          {{ card.definition }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardTest",
  data() {
    return {
      flashcards: [
      { word: "abandon", definition: "放棄", isFlipped: false },
    { word: "ability", definition: "能力", isFlipped: false },
    { word: "able", definition: "有能力的", isFlipped: false },
    { word: "about", definition: "關於", isFlipped: false },
    { word: "above", definition: "多於", isFlipped: false },
    { word: "abroad", definition: "國外", isFlipped: false },
    { word: "absence", definition: "缺席", isFlipped: false },
    { word: "absolute", definition: "絕對", isFlipped: false },
    { word: "absolutely", definition: "絕對地", isFlipped: false },
    { word: "absorb", definition: "吸收", isFlipped: false },
    { word: "abuse", definition: "虐待", isFlipped: false },
    { word: "academic", definition: "學術的", isFlipped: false },
    { word: "accept", definition: "接受", isFlipped: false },
    { word: "acceptable", definition: "可以接受", isFlipped: false },
    { word: "access", definition: "使用權", isFlipped: false },
    { word: "accident", definition: "事故", isFlipped: false },
    { word: "accommodation", definition: "住宿", isFlipped: false },
    { word: "accompany", definition: "陪伴", isFlipped: false },
    { word: "according to", definition: "根據", isFlipped: false },
    { word: "account", definition: "帳戶", isFlipped: false },
    { word: "accurate", definition: "準確的", isFlipped: false },
    { word: "accuse", definition: "控", isFlipped: false },
    { word: "achieve", definition: "達到", isFlipped: false },
    { word: "achievement", definition: "成就", isFlipped: false },
    { word: "acid", definition: "酸", isFlipped: false },
    { word: "acknowledge", definition: "承認", isFlipped: false },
    { word: "acquire", definition: "獲得", isFlipped: false },
    { word: "across", definition: "穿過", isFlipped: false },
    { word: "act", definition: "行為", isFlipped: false },
    { word: "action", definition: "行動", isFlipped: false },
    { word: "active", definition: "積極的", isFlipped: false },
    { word: "activist", definition: "活動家", isFlipped: false },
    { word: "activity", definition: "活動", isFlipped: false },
    { word: "actor", definition: "演員", isFlipped: false },
    { word: "actual", definition: "實際的", isFlipped: false },
    { word: "actually", definition: "實際上", isFlipped: false },
    { word: "adapt", definition: "適應", isFlipped: false },
    { word: "add", definition: "添加", isFlipped: false },
    { word: "addition", definition: "添加", isFlipped: false },
    { word: "additional", definition: "額外的", isFlipped: false },
    { word: "address", definition: "地址", isFlipped: false },
    { word: "adequate", definition: "足夠的", isFlipped: false },
    { word: "adjust", definition: "調整", isFlipped: false },
    { word: "administration", definition: "行政", isFlipped: false },
    { word: "administrative", definition: "行政", isFlipped: false },
    { word: "admire", definition: "欽佩", isFlipped: false },
    { word: "admission", definition: "入場", isFlipped: false },
    { word: "admit", definition: "承認", isFlipped: false },
    { word: "adopt", definition: "採納", isFlipped: false },
    { word: "adult", definition: "成人", isFlipped: false },
    { word: "advance", definition: "進步", isFlipped: false },
    { word: "advanced", definition: "先進的", isFlipped: false },
    { word: "advantage", definition: "優勢", isFlipped: false },
    { word: "advert", definition: "廣告", isFlipped: false },
    { word: "advertise", definition: "廣告", isFlipped: false },
    { word: "advertisement", definition: "廣告", isFlipped: false },
    { word: "advertising", definition: "廣告", isFlipped: false },
    { word: "advice", definition: "建議", isFlipped: false },
    { word: "adviser", definition: "顧問", isFlipped: false },
    { word: "affair", definition: "事務", isFlipped: false },
    { word: "affect", definition: "影響", isFlipped: false },
    { word: "afford", definition: "買得起", isFlipped: false },
    { word: "afraid", definition: "害怕的", isFlipped: false },
    { word: "after", definition: "後", isFlipped: false },
    { word: "afternoon", definition: "下午", isFlipped: false },
    { word: "afterwards", definition: "然後", isFlipped: false },
    { word: "again", definition: "再次", isFlipped: false },
    { word: "against", definition: "反對", isFlipped: false },
    { word: "age", definition: "年齡", isFlipped: false },
    { word: "aged", definition: "年齡", isFlipped: false },
    { word: "agency", definition: "機構", isFlipped: false },
    { word: "agent", definition: "代理人", isFlipped: false },
    { word: "aggressive", definition: "挑釁的", isFlipped: false },
    { word: "ago", definition: "前", isFlipped: false },
    { word: "agree", definition: "同意", isFlipped: false },
    { word: "agreement", definition: "協定", isFlipped: false },
    { word: "agriculture", definition: "農業", isFlipped: false },
    { word: "ahead", definition: "前方", isFlipped: false },
    { word: "aid", definition: "援助", isFlipped: false },
    { word: "aim", definition: "目的", isFlipped: false },
    { word: "air", definition: "空氣", isFlipped: false },
    { word: "aircraft", definition: "飛機", isFlipped: false },
    { word: "airline", definition: "航空公司", isFlipped: false },
    { word: "airport", definition: "飛機場", isFlipped: false },
    { word: "alarm", definition: "警報", isFlipped: false },
    { word: "album", definition: "專輯", isFlipped: false },
    { word: "alcohol", definition: "酒精", isFlipped: false },
    { word: "alive", definition: "活", isFlipped: false },
    { word: "all", definition: "全部", isFlipped: false },
    { word: "allow", definition: "允許", isFlipped: false },
    { word: "allowance", definition: "津貼", isFlipped: false },
    { word: "all right", definition: "好的", isFlipped: false },
    { word: "almost", definition: "幾乎", isFlipped: false },
    { word: "alone", definition: "獨自的", isFlipped: false },
    { word: "along", definition: "沿著", isFlipped: false },
    { word: "alongside", definition: "同時", isFlipped: false },
    { word: "already", definition: "已經", isFlipped: false },
    { word: "also", definition: "也", isFlipped: false },
    { word: "alter", definition: "改變", isFlipped: false },
    { word: "alternative", definition: "選擇", isFlipped: false },
    { word: "although", definition: "雖然", isFlipped: false },
    { word: "altogether", definition: "共", isFlipped: false },
    { word: "always", definition: "總是", isFlipped: false },
    { word: "amazing", definition: "驚人的", isFlipped: false },
    { word: "ambition", definition: "志向", isFlipped: false },
    { word: "ambulance", definition: "救護車", isFlipped: false },
    { word: "among", definition: "之中", isFlipped: false },
    { word: "amount", definition: "數量", isFlipped: false },
    { word: "analyse", definition: "分析", isFlipped: false },
    { word: "analysis", definition: "分析", isFlipped: false },
    { word: "analyst", definition: "分析師", isFlipped: false },
    { word: "ancient", definition: "古老的", isFlipped: false },
    { word: "and", definition: "和", isFlipped: false },
    { word: "anger", definition: "憤怒", isFlipped: false },
    { word: "angle", definition: "角度", isFlipped: false },
    { word: "angry", definition: "生氣的", isFlipped: false },
    { word: "animal", definition: "動物", isFlipped: false },
    { word: "announce", definition: "宣布", isFlipped: false },
    { word: "announcement", definition: "公告", isFlipped: false },
    { word: "annoy", definition: "惹惱", isFlipped: false },
    { word: "annual", definition: "年度的", isFlipped: false },
    { word: "answer", definition: "回答", isFlipped: false },
    { word: "anticipate", definition: "預料", isFlipped: false },
    { word: "anxiety", definition: "焦慮", isFlipped: false },
    { word: "anxious", definition: "焦慮的", isFlipped: false },
    { word: "any", definition: "任何", isFlipped: false },
    { word: "anybody", definition: "任何人", isFlipped: false },
    { word: "anyhow", definition: "無論如何", isFlipped: false },
    { word: "anyone", definition: "任何人", isFlipped: false },
    { word: "anything", definition: "任何事物", isFlipped: false },
    { word: "anyway", definition: "反正", isFlipped: false },
    { word: "anywhere", definition: "任何地方", isFlipped: false },
    { word: "apart", definition: "分開", isFlipped: false },
    { word: "apartment", definition: "公寓", isFlipped: false },
    { word: "apologize", definition: "道歉", isFlipped: false },
    { word: "apology", definition: "道歉", isFlipped: false },
    { word: "apparent", definition: "顯然", isFlipped: false },
    { word: "apparently", definition: "顯然", isFlipped: false },
    { word: "appeal", definition: "上訴", isFlipped: false },
    { word: "appear", definition: "出現", isFlipped: false },
    { word: "appearance", definition: "外貌", isFlipped: false },
    { word: "apple", definition: "蘋果", isFlipped: false },
    { word: "application", definition: "應用", isFlipped: false },
    { word: "apply", definition: "申請", isFlipped: false },
    { word: "appoint", definition: "委", isFlipped: false },
    { word: "appointment", definition: "預約", isFlipped: false },
    { word: "appreciate", definition: "欣賞", isFlipped: false },
    { word: "approach", definition: "方法", isFlipped: false },
    { word: "appropriate", definition: "合適的", isFlipped: false },
    { word: "approval", definition: "贊同", isFlipped: false },
    { word: "approve", definition: "批准", isFlipped: false },
    { word: "approximate", definition: "近似", isFlipped: false },
    { word: "architect", definition: "建築師", isFlipped: false },
    { word: "architecture", definition: "建築學", isFlipped: false },
    { word: "area", definition: "區域", isFlipped: false },
    { word: "argue", definition: "爭論", isFlipped: false },
    { word: "argument", definition: "爭論", isFlipped: false },
    { word: "arise", definition: "出現", isFlipped: false },
    { word: "arm", definition: "手臂", isFlipped: false },
    { word: "armed", definition: "武裝", isFlipped: false },
    { word: "army", definition: "軍隊", isFlipped: false },
    { word: "around", definition: "大約", isFlipped: false },
    { word: "arrange", definition: "安排", isFlipped: false },
    { word: "arrangement", definition: "安排", isFlipped: false },
    { word: "arrest", definition: "逮捕", isFlipped: false },
    { word: "arrival", definition: "到達", isFlipped: false },
    { word: "arrive", definition: "到達", isFlipped: false },
    { word: "art", definition: "藝術", isFlipped: false },
    { word: "article", definition: "文章", isFlipped: false },
    { word: "artificial", definition: "人造的", isFlipped: false },
    { word: "artist", definition: "藝術家", isFlipped: false },
    { word: "as", definition: "作為", isFlipped: false },
    { word: "ashamed", definition: "羞愧", isFlipped: false },
    { word: "aside", definition: "除此之外", isFlipped: false },
    { word: "ask", definition: "問", isFlipped: false },
    { word: "asleep", definition: "睡著了", isFlipped: false },
    { word: "aspect", definition: "方面", isFlipped: false },
    { word: "assess", definition: "評估", isFlipped: false },
    { word: "assessment", definition: "評估", isFlipped: false },
    { word: "assignment", definition: "任務", isFlipped: false },
    { word: "assist", definition: "協助", isFlipped: false },
    { word: "assistance", definition: "協助", isFlipped: false },
    { word: "assistant", definition: "助手", isFlipped: false },
    { word: "associate", definition: "聯繫", isFlipped: false },
    { word: "association", definition: "協會", isFlipped: false },
    { word: "assume", definition: "認為", isFlipped: false },
    { word: "assumption", definition: "假設", isFlipped: false },
    { word: "assure", definition: "保證", isFlipped: false },
    { word: "at", definition: "在", isFlipped: false },
    { word: "atmosphere", definition: "氣氛", isFlipped: false },
    { word: "attach", definition: "附", isFlipped: false },
    { word: "attack", definition: "攻擊", isFlipped: false },
    { word: "attempt", definition: "試圖", isFlipped: false },
    { word: "attend", definition: "出席", isFlipped: false },
    { word: "attention", definition: "注意力", isFlipped: false },
    { word: "attitude", definition: "態度", isFlipped: false },
    { word: "attorney", definition: "律師", isFlipped: false },
    { word: "attract", definition: "吸引", isFlipped: false }
      ],
    };
  },
  methods: {
    flipCard(index) {
      this.flashcards[index].isFlipped = !this.flashcards[index].isFlipped;
    },
    removeFlippedCards() {
      // 過濾掉已經翻過的卡片
      this.flashcards = this.flashcards.filter(card => !card.isFlipped);
    },
    transPage(item) {
      this.$router.push(`${item}`);
    },
  },
};
</script>

<style>
.app-container {
  text-align: center;
  font-family: Arial, sans-serif;
}

.flashcard {
  width: 200px;
  height: 120px;
  margin: 20px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
  perspective: 1000px;
}

.flashcard.flipped {

}

.flashcard .front,
.flashcard .back {
  position: absolute;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>