<script setup>
import { defineProps, ref, watchEffect } from "vue";

const props = defineProps({
  count: {
    type: Number,
    required: true
  }
});

const previousCount = ref(props.count);

watchEffect(() => {
  previousCount.value = props.count;
});
</script>

<template>
  <div class="container">
    <transition-group name="fade" tag="div" class="balls-container">
      <div class="ball" v-for="n in count" :key="n">
        <span style="--color: #48cae4; --i: 1px; --d: 2.5s"></span>
        <span style="--color: #90e0ef; --i: 1px; --d: 2.5s"></span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.balls-container {
  display: flex;
}

.ball {
  position: relative;
  width: 2rem;
  height: 2rem;
  margin-right: 1rem; 
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.ball span {
  position: absolute;
  width: calc(2rem + var(--i));
  height: calc(2rem + var(--i));
  border-radius: 100%;
  transform-origin: calc(50px + var(--i));
  background: var(--color);
  animation: ball-animation 5s linear infinite;
  animation-duration: calc(var(--d));
  mix-blend-mode: plus-lighter;
  filter: blur(4px);
}

.ball span:nth-child(even) {
  animation-direction: reverse;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes ball-animation {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
