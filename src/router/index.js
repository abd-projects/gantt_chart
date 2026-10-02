import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Tasks from '../pages/Tasks.vue'
import TaskInfo from '../pages/TaskInfo.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      component: Dashboard
    },
    {
      path: '/tasks',
      component: Tasks
    },
    {
      path: '/tasks/:id',
      component: TaskInfo
    }
  ]
})

export default router