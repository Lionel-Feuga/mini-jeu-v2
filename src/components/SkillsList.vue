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

const onMouseDown = (skill) => {
  longPressTimeout.value = setTimeout(() => {
    openDialog(skill);
  }, 300); 
};

const onMouseUp = () => {
  if (longPressTimeout.value) {
    clearTimeout(longPressTimeout.value);
  }
};
</script>

<template>
  <div class="dropdown-container">
    <v-menu activator="parent" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="#ffb703" v-bind="attrs" v-on="on">Compétences</v-btn>
      </template>

      <v-list
        class="text-capitalize ml-4 mt-3 pa-0"
        style="background: none; box-shadow: none"
      >
        <v-list-item
          v-for="(skill, index) in skills"
          :key="index"
          @mousedown="onMouseDown(skill)"  
          @mouseup="onMouseUp"            
          @mouseleave="onMouseUp"          
          class="rounded-lg"
          style="background-color: #ffb703; margin-bottom: 10px; cursor: pointer;"
        >
          <v-list-item-title>
            {{ skill.name }}
            <span v-for="n in skill.cost_pa" :key="n">
              <img
                src="/assets/icons/energie-icon.png"
                alt="energie"
                style="height: 14px; margin-left: 2px"
              />
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
          <p>
            <strong>Points d'action nécessaires :</strong>
            {{ selectedSkill?.cost_pa }}
          </p>
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

/* pop-up */
.custom-dialog {
  background-color: #1d3557;
  color: #f1faee;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
}

.custom-title {
  font-size: 20px;
  font-weight: bold;
  color: #a8dadc;
  border-bottom: 2px solid #457b9d;
}

.custom-text {
  font-size: 16px;
  line-height: 1.6;
}

.close-btn {
  background-color: #e63946;
  color: white;
  font-weight: bold;
  border-radius: 8px;
}
</style>
