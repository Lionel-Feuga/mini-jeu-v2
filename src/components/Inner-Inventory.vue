  <script setup>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useRoute } from "vue-router";

  const player = ref({});
  const equippedItems = ref([]);
  const unequippedItems = ref([]);

  const showContextMenu = ref(false);
  const contextMenuPosition = ref({ x: 0, y: 0 });
  const selectedItem = ref(null);

  const showDetailsPanel = ref(false); // Pour afficher le panneau des détails
  const detailsItem = ref(null); // Stocke l'item pour lequel on veut afficher les détails

  const route = useRoute();

  const fetchPlayer = async () => {
    const playerId = route.params.id;
    const response = await fetch(`http://localhost:3001/api/players/${playerId}`);
    if (response.ok) {
      player.value = await response.json();
    } else {
      console.error("Failed to fetch player:", await response.text());
    }
  };

  const fetchPlayerInventory = async () => {
    const playerId = route.params.id;
    try {
      const response = await fetch(
        `http://localhost:3001/api/inventories/player/${playerId}`
      );
      if (response.ok) {
        const inventory = await response.json();
        equippedItems.value = inventory.filter(
          (item) => item.is_equipped === true
        );
        unequippedItems.value = inventory.filter(
          (item) => item.is_equipped === false
        );
      } else {
        console.error("Erreur lors de la récupération de l'inventaire du joueur");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Gestion du clic droit avec position ajustée
  const handleRightClick = (event, item) => {
    event.preventDefault();
    selectedItem.value = item;

    const parentRect = event.currentTarget
      .closest(".container")
      .getBoundingClientRect();

    const offsetX = event.clientX - parentRect.left;
    const offsetY = event.clientY - parentRect.top;

    const maxX = parentRect.width - 150;
    const maxY = parentRect.height - 80;

    const marginX = 20;
    const marginY = 20;

    contextMenuPosition.value = {
      x: Math.min(offsetX + marginX, maxX),
      y: Math.min(offsetY + marginY, maxY),
    };

    showContextMenu.value = true;
  };

  const closeContextMenu = () => {
    showContextMenu.value = false;
  };

  const toggleEquipItem = async () => {
    if (selectedItem.value) {
      const updatedStatus = !selectedItem.value.is_equipped;
      try {
        const response = await fetch(
          `http://localhost:3001/api/inventories/${selectedItem.value.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ is_equipped: updatedStatus }),
          }
        );
        if (response.ok) {
          fetchPlayerInventory();
          closeContextMenu();
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'item", error);
      }
    }
  };

  const deleteItem = async () => {
    if (selectedItem.value) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/inventories/${selectedItem.value.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          fetchPlayerInventory();
          closeContextMenu();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'item", error);
      }
    }
  };

  // Nouvelle fonction pour afficher les détails d'un item
  const showDetails = () => {
    if (selectedItem.value) {
      detailsItem.value = selectedItem.value; // Stocke l'item à afficher dans les détails
      showDetailsPanel.value = true; // Affiche le panneau des détails
      closeContextMenu(); // Ferme le menu contextuel
    }
  };

  // Ajoute un écouteur pour fermer le menu contextuel en cas de clic à l'extérieur
  onMounted(() => {
    fetchPlayerInventory();
    fetchPlayer();
    document.addEventListener("click", closeContextMenu);
  });

  // Supprime l'écouteur pour éviter les fuites de mémoire
  onBeforeUnmount(() => {
    document.removeEventListener("click", closeContextMenu);
  });
  </script>

  <template>
    <div class="big-container ml-10 mt-10 d-flex justify-center align-center">
      <div class="container">
        <p class="text-capitalize ml-3 mt-2" style="font-size: 1.2rem">
          <b>objets équipés</b>
        </p>
        <div
          class="equip-boxes-container mt-2 ms-1 me-2 d-flex justify-space-around flex-wrap ga-3"
        >
          <div
            v-for="(item, index) in equippedItems"
            :key="index"
            class="equip_boxes d-flex justify-center align-center"
            @contextmenu.prevent="handleRightClick($event, item)"
          >
            <div class="inner-equip-boxes">
              <img :src="item.Item.image" alt="Item Image" class="item-image" />
            </div>
          </div>

          <div
            v-for="i in 4 - (equippedItems?.length || 0)"
            :key="'empty-equip-' + i"
            class="equip_boxes d-flex justify-center align-center"
          >
            <div class="inner-equip-boxes"></div>
          </div>
        </div>

        <p class="text-capitalize ml-3 mt-2" style="font-size: 1.2rem">
          <b>objets non équipés</b>
        </p>
        <div
          class="equip-boxes-container mt-2 ms-1 me-2 d-flex justify-space-around flex-wrap ga-3"
        >
          <div
            v-for="(item, index) in unequippedItems"
            :key="index"
            class="equip_boxes d-flex justify-center align-center"
            @contextmenu.prevent="handleRightClick($event, item)"
          >
            <div class="inner-equip-boxes">
              <img :src="item.Item.image" alt="Item Image" class="item-image" />
            </div>
          </div>

          <div
            v-for="i in 16 - (unequippedItems?.length || 0)"
            :key="'empty-unequip-' + i"
            class="equip_boxes d-flex justify-center align-center"
          >
            <div class="inner-equip-boxes"></div>
          </div>
        </div>

        <div class="gold d-flex justify-end align-center ga-1 mt-2 me-3">
          {{ player.gold }}
          <img
            src="/assets/icons/golds-icon.png"
            alt="Golds"
            style="height: 14px; width: 18px"
          />
        </div>

        <!-- Menu contextuel -->
        <div
          v-if="showContextMenu"
          :style="{
            top: `${contextMenuPosition.y}px`,
            left: `${contextMenuPosition.x}px`,
            position: 'absolute',
            zIndex: 9999,
          }"
          class="context-menu"
        >
          <ul>
            <li
              v-if="
                selectedItem?.Item.type === 'ARMOR' ||
                selectedItem?.Item.type === 'WEAPON'
              "
              @click="toggleEquipItem"
            >
              {{ selectedItem?.is_equipped ? "Déséquiper" : "Équiper" }}
            </li>
            <li v-else @click="useItem">Utiliser</li>
            <li @click="showDetails">Détails</li>
            <!-- Nouvel ajout pour afficher les détails -->
            <li @click="deleteItem">Jeter</li>
          </ul>
        </div>

        <!-- Panneau des détails de l'item -->
        <div class="outside-panel">
          <div v-if="showDetailsPanel && detailsItem" class="details-panel">
            <div class="details-container">
              <h3>Détails de l'objet</h3>
              <p><u>Nom</u> : {{ detailsItem.Item.name }}</p>
              <p><u>Description</u> : {{ detailsItem.Item.description }}</p>
              <p class="golds">{{ detailsItem.Item.price_sell }} <img src="/assets/icons/golds-icon.png" alt=""></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .big-container {
    background-color: rgb(197, 121, 85);
    height: 30rem;
    width: 21rem;
    border: 2px solid black;
    border-radius: 30px;
    filter: contrast(160%);
  }

  .container {
    height: 96%;
    width: 95%;
    background-color: rgb(123, 54, 62);
    border: 2px solid black;
    border-radius: 20px;
  }

  .equip_boxes {
    height: 59px;
    width: 59px;
    background-color: #c37b59;
    border: 3px solid black;
    position: relative;
  }

  .inner-equip-boxes {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90%;
    width: 90%;
    background-color: #944548;
    box-shadow: inset 0px 10px 12px -5px black;
  }

  .context-menu {
    background-color: #780a17;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  .context-menu ul {
    list-style: none;
  }

  .context-menu li {
    padding: 10px 20px;
    cursor: pointer;
    border: 2px #fa1e10 solid;
  }

  .context-menu li:hover {
    background-color: #fa1e10;
  }

  .golds {
    position: relative;
    top: 15px;
    left: 82%;
  }

  .golds img {
    padding-top: 4px;
    height: 18px;
    width: auto;
  }

  .item-image {
    height: 80%;
    width: auto;
    margin-top: 8%;
  }

  .details-panel {
    position: absolute;
    top: 5rem;
    left: 25rem;
    background-color: #944548;
    border: 5px solid #c37b59;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 1.5px black;
    padding: 20px;
    width: 250px;
    filter: contrast(110%);
  }

  .details-container h3 {
    margin-top: 0;
  }
  </style>
