import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CharacterCreationView from '../views/CharacterCreationView.vue';
import BattleView from '../views/BattleView.vue';

const routes = [
  { 
    path: '/', 
    component: HomeView 
  },
  {
    path: '/characterCreation',
    component: CharacterCreationView
  },
  { 
    path: '/battle', 
    component: BattleView 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
