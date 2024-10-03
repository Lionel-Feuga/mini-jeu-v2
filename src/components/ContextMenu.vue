<script setup>
import { ref, reactive } from 'vue';

const showMenu = ref(false);
const menuPosition = reactive({ x: 0, y: 0 });
const hoveredItem = ref(null);

const openMenu = (event, item) => {
  event.preventDefault();
  menuPosition.x = event.clientX;
  menuPosition.y = event.clientY;
  hoveredItem.value = item;
  showMenu.value = true;
};

const closeMenu = () => {
  showMenu.value = false;
};

const handleDesequipItem = async () => {
  if (hoveredItem.value) {
    await fetch(`http://localhost:3001/api/inventories/${hoveredItem.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_equipped: false }),
    });
    closeMenu();
  }
};

const handleEquipItem = async () => {
  if (hoveredItem.value) {
    await fetch(`http://localhost:3001/api/inventories/${hoveredItem.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_equipped: true }),
    });
    closeMenu();
  }
};

const handleRemoveItem = async () => {
  if (hoveredItem.value) {
    await fetch(`http://localhost:3001/api/inventories/${hoveredItem.value.id}`, {
      method: 'DELETE',
    });
    closeMenu();
  }
};
</script>

<template>
  <div v-if="showMenu" :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }" class="context-menu">
    <ul>
      <li v-if="hoveredItem?.is_equipped" @click="handleDesequipItem">Déséquiper</li>
      <li v-if="!hoveredItem?.is_equipped" @click="handleEquipItem">Équiper</li>
      <li @click="handleRemoveItem">Jeter</li>
    </ul>
  </div>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid black;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 5px 10px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #eee;
}
</style>
