<template>
  <div class="sentence-level-page">
    <div class="container">
      <h2 class="page-title">短句練習</h2>
      <p class="page-subtitle">選擇難度開始練習</p>

      <div class="level-cards">
        <!-- 基礎 -->
        <div class="level-card" @click="goToPractice('basic')">
          <div class="level-icon">🌱</div>
          <h3 class="level-title">基礎</h3>
          <p class="level-desc">0 - 2000 字</p>
          <p class="level-count">約 4000 - 5000 句</p>
        </div>

        <!-- 中級 -->
        <div class="level-card" @click="goToPractice('intermediate')">
          <div class="level-icon">🌿</div>
          <h3 class="level-title">中級</h3>
          <p class="level-desc">2000 - 4000 字</p>
          <p class="level-count">約 4000 - 5000 句</p>
        </div>

        <!-- 進階 -->
        <div class="level-card" @click="goToPractice('advanced')">
          <div class="level-icon">🌳</div>
          <h3 class="level-title">進階</h3>
          <p class="level-desc">4000 - 6000 字</p>
          <p class="level-count">約 4000 - 5000 句</p>
        </div>
      </div>

      <!-- 返回按鈕 -->
      <div class="back-link">
        <router-link to="/ListTry50">← 返回文章列表</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListSentenceLevel',
  methods: {
    goToPractice(level) {
      this.$router.push(`/sentence-practice/${level}`);
    },
  },
};
</script>

<style scoped>
.sentence-level-page {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f5f7fa;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 40px;
}

.level-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.level-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 250px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.level-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.level-card:nth-child(1):hover {
  border: 2px solid #27ae60;
}

.level-card:nth-child(2):hover {
  border: 2px solid #f39c12;
}

.level-card:nth-child(3):hover {
  border: 2px solid #e74c3c;
}

.level-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.level-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.level-desc {
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 5px;
}

.level-count {
  color: #95a5a6;
  font-size: 0.9rem;
}

.back-link {
  text-align: center;
  margin-top: 40px;
}

.back-link a {
  color: #3498db;
  text-decoration: none;
  font-size: 1rem;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>