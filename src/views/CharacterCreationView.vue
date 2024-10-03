<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const mages = [
  "/assets/players/mage1.png",
  "/assets/players/mage2.png",
  "/assets/players/mage3.png",
  "/assets/players/mage4.png",
];

const selectedImage = ref(null);
const characterName = ref("");
const imageSelected = ref(false);
const showCreationForm = ref(false); 
const characters = ref([]); 

const router = useRouter();

const selectImage = (mage) => {
  selectedImage.value = mage;
  imageSelected.value = true;
};

const submitCharacter = async () => {
  if (characterName.value && selectedImage.value) {
    const response = await fetch("http://localhost:3001/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: characterName.value, 
        image: selectedImage.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const playerId = data.id;
      router.push(`/battle/${playerId}`); 
    } else {
      console.error("Failed to submit character:", await response.text());
    }
  }
};


const fetchCharacters = async () => {
  const response = await fetch("http://localhost:3001/api/players");
  if (response.ok) {
    characters.value = await response.json();
  }
};

const selectExistingCharacter = (characterId) => {
  router.push(`/battle/${characterId}`);
};

const startNewCharacterCreation = () => {
  showCreationForm.value = true;
};

onMounted(() => {
  fetchCharacters(); 
});
</script>

<template>
  <div class="body">
    <v-container class="d-flex flex-column justify-center h-100">
      <v-row class="align-end" v-if="characters.length > 0 && !showCreationForm">
        <v-col v-for="(character, index) in characters" :key="index">
          <div class="character">
            <p class="outlined-text">{{ character.name }}</p>
            <v-img
              class="existing-character"
              :src="character.image"
              alt="Character Image"
              contain
              height="200"
              @click="selectExistingCharacter(character.id)"
            />
          </div>
        </v-col>
      </v-row>

      <v-row v-if="!showCreationForm && characters.length > 0">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn @click="startNewCharacterCreation">
            Créer un nouveau personnage
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="align-center" v-if="showCreationForm || characters.length === 0">
        <v-row v-if="!imageSelected">
          <v-col cols="3" v-for="(mage, index) in mages" :key="index">
            <v-img
              class="imageNotSelected"
              :src="mage"
              @click="selectImage(mage)"
              alt="mage-image"
              contain
              height="400"
            />
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-img
              :src="selectedImage"
              class="selected-image"
              alt="selected-mage"
              contain
              height="300"
            />
          </v-col>
          <v-col class="d-flex flex-column justify-center align-center">
            <v-text-field
              class="outlined-text text-center"
              label="Nom de votre personnage"
              v-model="characterName"
              style="min-width: 15rem"
            />
            <v-btn @click="submitCharacter" :disabled="!characterName || !selectedImage">OK</v-btn>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.body {
  background-image: url("/assets/backgrounds/homeBackground.png");
  background-size: cover;
  height: 100vh;
}

.character {
  text-align: center;
  margin-bottom: 20px;
}

.imageNotSelected:hover {
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.existing-character:hover {
  transform: scale(1.2);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.v-btn {
  margin-top: 20px;
}
</style>
