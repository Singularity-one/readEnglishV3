<template>
  <div id="app">
    <h1>Learn English</h1>
    <RouterLink to="/Listsentencelevel" @click="transPage('/Listsentencelevel')"
      >Listsentencelevel</RouterLink
    >&nbsp;

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {
    transPage(item) {
      console.log("item", item);
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
