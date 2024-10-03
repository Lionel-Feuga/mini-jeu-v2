import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CharacterCreationView from '../views/CharacterCreationView.vue';
import BattleView from '../views/BattleView.vue';
import test from '../views/test.vue';
import Test from '../views/test.vue';

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
    path: '/battle/:id', 
    name: 'battle',
    component: BattleView,
    props: true  
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
