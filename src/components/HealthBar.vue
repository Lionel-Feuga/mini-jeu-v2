<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  percentage: {
    type: Number,
    required: true
  }
});

const healthColor = computed(() => {
  const r = Math.min(255, Math.floor((100 - props.percentage) * 2.55)); 
  const g = Math.min(255, Math.floor(props.percentage * 2.55)); 
  return `rgb(${r}, ${g}, 0)`;
});
</script>

<template>
  <div class="health-bar-container">
    <div
      class="health-bar"
      :style="{ width: percentage + '%', backgroundColor: healthColor }"
    ></div>
  </div>
</template>

<style scoped>
.health-bar-container {
  width: 10rem;
  height: 1.2rem;
  background-color: #ccc;
  border-radius: 12px;
  margin: 10px 0;
  border: 1px solid #000;
}

.health-bar {
  height: 100%;
  border-radius: 12px;
  transition: width 0.3s ease, background-color 0.3s ease;
}
</style>
