import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'temp',
    component: () => import('../components/HelloWorld.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginSwitch.vue')
  },
  {
    path: '/editor/:hashcode',
    name: 'editor',
    component: () => import('../views/Editor.vue'),
  },
  {
    path: '/user',
    name: 'userHome',
    component: () => import('../components/user/UserHome.vue')
  },
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('../components/test.vue')
  // },
  {
    path: '/home',
    redirect: '/home/recent',
    name: 'home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/home/recent', 
        component: () => import('../components/home/Recent.vue')
      },
      {
        path: '/home/desktop', 
        component: () => import('../components/home/Desktop.vue')
      },
      {
        path: '/home/group', 
        component: () => import('../components/home/Group.vue')
      },
      {
        path: '/home/collection', 
        component: () => import('../components/home/Collection.vue')
      },
      {
        path: '/home/trash', 
        component: () => import('../components/home/Trash.vue')
      },
      {
        path: '/home/space/:teamId', 
        name: 'space',
        component: () => import('../components/home/GroupSpace.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router