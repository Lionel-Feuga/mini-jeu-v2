<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  skills: {
    type: Array,
    required: true,
  },
});

const dialog = ref(false);
const selectedSkill = ref(null);
const longPressTimeout = ref(null);

const openDialog = (skill) => {
  selectedSkill.value = skill;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const handleMouse = (action, skill = null) => {
  if (action === 'down') {
    longPressTimeout.value = setTimeout(() => openDialog(skill), 300);
  } else {
    clearTimeout(longPressTimeout.value);
  }
};
</script>

<template>
  <div class="dropdown-container">
    <v-menu activator="parent" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="#0077b6" v-bind="attrs" v-on="on" class="activator-btn">Compétences</v-btn>
      </template>

      <v-list class="skill-list" style="background: none; box-shadow: none;">
        <v-list-item
          v-for="(skill, index) in skills"
          :key="index"
          @mousedown="handleMouse('down', skill)"
          @mouseup="handleMouse('up')"
          @mouseleave="handleMouse('up')"
          class="skill-item rounded-lg ms-3"
        >
          <v-list-item-title class="skill-title">
            {{ skill.name }}
            <span v-for="n in skill.cost_pa" :key="n">
              <img src="/assets/icons/energie-icon.png" alt="energie" class="energie-icon"/>
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
      <v-card class="custom-dialog">
        <v-card-title class="custom-title">{{ selectedSkill?.name }}</v-card-title>
        <v-card-text class="custom-text">
          <p><strong>Dégâts :</strong> {{ selectedSkill?.damage }}</p>
          <p><strong>Points d'action nécessaires :</strong> {{ selectedSkill?.cost_pa }}</p>
          <p><strong>Description :</strong> {{ selectedSkill?.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="close-btn" @click="closeDialog">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.dropdown-container {
  position: absolute;
  left: 10%;
  top: 30%;
  transform: translateY(-50%);
}

.activator-btn {
  border: 1px solid #03045e;
}

.skill-list {
  background: none;
  box-shadow: none;
}

.skill-item {
  background-color: #0077b6;
  border: 1px solid #03045e;
  margin-bottom: 10px;
  cursor: pointer;
}

.skill-title {
  color: white;
}

.energie-icon {
  height: 14px;
  margin-left: 2px;
}

.custom-dialog {
  background-color: #0077b6;
  color: white;
  border-radius: 12px;
  padding: 16px;
  border: 3px solid #03045e;
}

.custom-title {
  font-size: 20px;
  font-weight: bold;
  border-bottom: 2px solid #03045e;
}

.custom-text {
  font-size: 16px;
  line-height: 1.6;
}

.close-btn {
  background-color: #03045e;
}

.close-btn:hover {
  background-color: #e63946;
  color: white;
  font-weight: bold;
  border-radius: 8px;
}
</style>
