<script setup>
import {HexaViewer} from "./hex-editor.js";
const onFileChange = ({target:{files:[file]}})=> {
  const viewer = new HexaViewer('binary-selector')
  viewer.load(file)
}
</script>

<template>
  <input type="file" id="binary-selector" @change="onFileChange">
</template>

<style scoped>

</style>
