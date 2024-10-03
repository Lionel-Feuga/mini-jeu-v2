<script setup>
import { onMounted } from "vue";
import { gsap } from "gsap";

const animateText = () => {
  const textElement = document.querySelector(".animated-text");

  gsap.fromTo(
    textElement,
    { opacity: 0, scale: 0.5 }, 
    {
      opacity: 1,
      scale: 1.5, 
      duration: 2.5,
      ease: "power1.inOut",
      yoyo: false, 
      onComplete: () => {
        gsap.to(textElement, {
          opacity: 0, 
          duration: 1,
          onComplete: () => {
            textElement.style.display = "none"; 
          },
        });
      },
    }
  );
};

onMounted(() => {
  animateText();
});
</script>

<template>
  <div class="animated-text outlined-text">Que l'aventure commence !</div>
</template>

<style scoped>
.animated-text {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
  font-weight: bold;
}
</style>
