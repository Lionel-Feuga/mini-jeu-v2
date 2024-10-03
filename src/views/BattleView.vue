<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import HealthBar from "../components/HealthBar.vue";
import ActionPoints from "../components/ActionPoints.vue";
import StartText from "../components/StartText.vue";
import SkillsList from "../components/SkillsList.vue";
import Inventory from "../components/Inventory.vue";

const player = ref(null);
const HP = ref(60);
const AP = ref(3);
const maxHP = ref(60);
const skills = ref([]);

const enemy = ref(null);
const enemyHP = ref(0);
const enemyMaxHp = ref(0);

const route = useRoute();

const fetchPlayer = async () => {
  const playerId = route.params.id;
  const response = await fetch(`http://localhost:3001/api/players/${playerId}`);
  if (response.ok) {
    player.value = await response.json();
    HP.value = player.value.HP;
    maxHP.value = player.value.HP;
    AP.value = player.value.AP;
  } else {
    console.error("Failed to fetch player:", await response.text());
  }
};

const fetchSkills = async () => {
  const playerId = route.params.id;
  const response = await fetch(
    `http://localhost:3001/api/players/${playerId}/skills`
  );
  if (response.ok) {
    skills.value = await response.json();
  } else {
    console.error("Failed to fetch skills:", await response.text());
  }
};

const fetchEnemy = async () => {
  const response = await fetch(`http://localhost:3001/api/enemies`);
  if (response.ok) {
    const enemies = await response.json();
    enemy.value = enemies[0];
    enemyHP.value = enemy.value.HP;
    enemyMaxHp.value = enemy.value.HP;
  } else {
    console.error("Failed to fetch enemy:", await response.text());
  }
};

const healthPercentage = computed(() => {
  return (HP.value / maxHP.value) * 100;
});
const enemyHealthPercentage = computed(() => {
  return (enemyHP.value / enemyMaxHp.value) * 100;
});

onMounted(() => {
  fetchPlayer();
  fetchSkills();
  fetchEnemy();
});
</script>

<template>
  <div class="body">
    <StartText />
    <Inventory />
    <v-container class="h-100">
      <v-row class="h-100 justify-space-around">
        <v-vol
          class="d-flex flex-column outlined-text justify-center text-center align-center"
        >
          <p class="mr-7 mt-16">HP: {{ HP }}</p>
          <HealthBar :percentage="enemyHealthPercentage" class="mr-7" />
          <div class="d-flex flex-column align-center">
            <img :src="player?.image" alt="Player Image" />
            <ActionPoints :count="AP" class="w-auto mr-10" />
          </div>
          <div>
            <SkillsList :skills="skills" />
          </div>
        </v-vol>
        <v-vol
          class="d-flex flex-column outlined-text justify-center text-center align-center"
        >
          <p class="mr-7 mt-15">HP: {{ enemyHP }}</p>
          <HealthBar :percentage="healthPercentage" class="mr-7" />
          <div class="d-flex flex-column align-center">
            <img :src="enemy?.image" alt="Player Image" />
          </div>
        </v-vol>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.body {
  height: 100vh;
  width: auto;
  margin: 0;
  padding: 0;
  background-image: url("/assets/backgrounds/battleBackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;
}

img {
  height: 20rem;
}
</style>
