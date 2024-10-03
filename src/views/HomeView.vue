<script setup>
import GlowingButton from "../components/GlowingButton.vue";
</script>

<template>
  <body style="height: 100vh">
    <v-container>
      <v-row>
        <v-col
          class="page d-flex flex-column justify-center align-center text-center ga-5"
        >
          <h1>Bienvenue dans mon jeu !</h1>
          <router-link to="/characterCreation"
            ><GlowingButton> Start</GlowingButton></router-link
          >
        </v-col>
      </v-row>
    </v-container>
  </body>
</template>

<style scoped>
body {
  background-image: url("/assets/backgrounds/homeBackground.png");
  background-size: cover;
  font-size: 2rem;
}

.page {
  position: absolute;
  top: 40%;
  left: 0%;
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
