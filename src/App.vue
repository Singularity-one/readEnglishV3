<template>
  <div id="app">
    <h1>Learn 3000 English words</h1>
    <!-- 渲染路由內容 -->
    <RouterLink to="/DayEn15" @click="transPage('/DayEn15')">DayEn15</RouterLink>&nbsp;
    <RouterLink to="/excelUpdata" @click="transPage('/excelUpdata')">ExcelUpdata</RouterLink>&nbsp;
    <RouterLink to="/excelView" @click="transPage('/excelView')">ExcelView</RouterLink>&nbsp;
    <RouterLink to="/ListTry50" @click="transPage('/ListTry50')">ListTry50</RouterLink>&nbsp;

    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  methods: {
    transPage(item) {
      console.log("item",item)
      this.$router.push(`${item}`);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>