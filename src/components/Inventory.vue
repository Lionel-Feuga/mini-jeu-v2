<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import InnerInventory from "./Inner-Inventory.vue";

const showInventory = ref(false);
const inventoryRef = ref(null);
const inventoryIconRef = ref(null); 

const toggleInventory = () => {
  showInventory.value = !showInventory.value;
};

const handleClickOutside = (event) => {
  if (
    showInventory.value &&
    inventoryRef.value &&
    !inventoryRef.value.contains(event.target) &&
    !inventoryIconRef.value.contains(event.target) 
  ) {
    showInventory.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div>
    <img
      ref="inventoryIconRef"
      class="inventory-icon"
      src="/assets/icons/inventory-icon.png"
      alt="Inventory"
      @click="toggleInventory"
    />

    <div v-if="showInventory" ref="inventoryRef" class="in-inventory">
      <InnerInventory />
    </div>
  </div>
</template>

<style scoped>
.inventory-icon {
  cursor: pointer;
  position: absolute;
  bottom: 10%;
  left: 5%;
  width: 80px;
}

.in-inventory {
  position: absolute;
  bottom: 19%;
  left: 6.5%;
  border-radius: 10px;
  padding: 16px;
  color: white;
  z-index: 9999;
}
</style>
