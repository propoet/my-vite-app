<script setup lang="ts">
// import HelloWorld from "@/components/HelloWorld.vue";
const message = ref("Hello World");
const { count, increment } = useCounter();
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
  <p>{{ message }}</p>
  <p>{{ count }}</p>
  <button @click="increment">Increment</button>
  <SvgIcon name="vue"></SvgIcon>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
