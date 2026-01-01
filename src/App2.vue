<template>
  <div id="app" class="app-container">
    <h1>Flashcard App</h1>
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
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      flashcards: [
        { word: "apple", definition: "A fruit that is red or green.", isFlipped: false },
        { word: "book", definition: "A set of written or printed pages.", isFlipped: false },
        { word: "car", definition: "A vehicle with four wheels.", isFlipped: false },
      ],
    };
  },
  methods: {
    flipCard(index) {
      this.flashcards[index].isFlipped = !this.flashcards[index].isFlipped;
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
  transform: rotateY(180deg);
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

.flashcard .back {
  transform: rotateY(180deg);
  background: #ffe4b2;
}
</style>