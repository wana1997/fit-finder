<template>
  <div id="app">
    <ChatWindow />
  </div>
</template>

<script setup>
import ChatWindow from './components/ChatWindow.vue'
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>
