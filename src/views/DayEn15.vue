<template>
  <div>
    <button @click="transPage('/')">回首頁</button>
    <RouterLink to="/dayOne" @click="transPage('/dayOne')">1</RouterLink>
  </div>
</template>

<script>
export default {
  name: 'DayEn15',
  methods: {
    transPage(item) {
      this.$router.push(`${item}`);
    },
  },




  
};
</script>