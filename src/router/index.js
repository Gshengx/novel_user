import {createRouter, createWebHistory} from 'vue-router'
import { routerMap } from './router.config'

export default createRouter({
  history: createWebHistory(),
  routes: routerMap
})
