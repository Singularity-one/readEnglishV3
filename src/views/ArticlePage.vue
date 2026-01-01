<template>
  <ArticleReader v-if="article" :articleConfig="article" />
  <div v-else class="error-message">
    <h2>文章載入失敗</h2>
    <p>找不到對應的文章配置</p>
    <router-link to="/ListTry50">返回列表</router-link>
  </div>
</template>

<script>
import ArticleReader from '@/components/ArticleReader.vue';
import { getArticleByRoute } from '@/data/articles';

export default {
  name: 'ArticlePage',
  components: {
    ArticleReader
  },
  data() {
    return {
      article: null
    };
  },
  created() {
    // 從當前路由獲取文章配置
    const currentRoute = this.$route.path;
    this.article = getArticleByRoute(currentRoute);
    
    if (!this.article) {
      console.error('找不到文章配置:', currentRoute);
    }
  },
  watch: {
    // 監聽路由變化,支援在不同文章間切換
    '$route.path'(newPath) {
      this.article = getArticleByRoute(newPath);
      if (!this.article) {
        console.error('找不到文章配置:', newPath);
      }
    }
  }
};
</script>

<style scoped>
.error-message {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

.error-message h2 {
  margin-bottom: 1rem;
}

.error-message a {
  color: #007bff;
  text-decoration: none;
}

.error-message a:hover {
  text-decoration: underline;
}
</style>