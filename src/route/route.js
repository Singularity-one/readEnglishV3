import { createRouter, createWebHistory } from 'vue-router';


// 短句練習頁面
import Listsentencelevel from '../views/Listsentencelevel.vue';
import SentencePractice from '../views/SentencePractice.vue';

const routes = [
  
  // 短句練習頁面
  { path: '/Listsentencelevel', name: 'Listsentencelevel', component: Listsentencelevel },
  { path: '/sentence-level', name: 'SentenceLevel', component: Listsentencelevel },
  { path: '/sentence-practice/:level', name: 'SentencePractice', component: SentencePractice },
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;