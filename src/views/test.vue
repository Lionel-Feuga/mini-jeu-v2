<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const items = ref([]);
const route = useRoute();

const fetchPlayerInventory = async () => {
  const playerId = route.params.id;
  try {
    const response = await fetch(
      `http://localhost:3001/api/inventories/player/${playerId}`
    );
    if (response.ok) {
      const inventory = await response.json();
      items.value = inventory;
    } else {
      console.error("Erreur lors de la récupération de l'inventaire du joueur");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};

onMounted(() => {
  fetchPlayerInventory();
});
</script>

<template>
  <div class="big-container ml-10 mt-10 d-flex justify-center align-center">
    <div class="container">
      <p class="text-capitalize ml-3 mt-2" style="font-size: 1.2rem">
        <b>objets</b>
      </p>
      <div
        class="equip-boxes-container mt-2 ms-1 me-2 d-flex justify-space-around flex-wrap ga-3"
      >
        <!-- Affichage des items dans les cases -->
        <div
          v-for="(item, index) in items"
          :key="index"
          class="equip_boxes d-flex justify-center align-center"
        >
          <img
            :src="item.Item.image"
            alt="Item Image"
            class="inner-equip-boxes"
          />
        </div>

        <!-- Affichage des slots vides si le joueur n'a pas assez d'items -->
        <div
          v-for="i in 20 - items.length"
          :key="'empty-' + i"
          class="equip_boxes d-flex justify-center align-center"
        >
          <div class="inner-equip-boxes"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="big-container ml-10 mt-10 d-flex justify-center align-center " style="width: 22rem; height: 14rem;">
    <div class="container my-3">
       name 
       description
       price_sell
    </div>
  </div>
</template>

<style scoped>
.big-container {
  background-color: rgb(197, 121, 85, 0.6);
  height: 27rem;
  width: 21rem;
  border: 2px solid black;
  border-radius: 30px;
  filter: contrast(200%);
}

.container {
  height: 96%;
  width: 95%;
  background-color: rgb(123, 54, 62, 0.54);
  border: 2px solid black;
  border-radius: 20px;
}

.equip_boxes {
  height: 59px;
  width: 59px;
  background-color: #c37b59;
  border: 3px solid black;
}

.inner-equip-boxes {
  height: 90%;
  width: 90%;
  background-color: #944548;
  box-shadow: inset 0px 10px 12px -5px black;
}
</style>
