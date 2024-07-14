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
  {
    path: '/home',
    redirect: '/home/recent',
    name: 'home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/home/recent', 
        name: 'recent',
        component: () => import('../components/home/Recent.vue')
      },
      {
        path: '/home/desktop', 
        name: 'desktop',
        component: () => import('../components/home/Desktop.vue')
      },
      {
        path: '/home/group', 
        name: 'group',
        component: () => import('../components/home/Group.vue')
      },
      {
        path: '/home/collection', 
        name: 'collection',
        component: () => import('../components/home/Collection.vue')
      },
      {
        path: '/home/trash', 
        name: 'trash',
        component: () => import('../components/home/Trash.vue')
      },
      {
        path: '/home/space/:teamId', 
        name: 'space',
        component: () => import('../components/home/GroupSpace.vue')
      },
      {
        path: '/home/folder/:docId', 
        name: 'folder',
        component: () => import('../components/home/Folder.vue')
      },
      {
        path: '/home/search', 
        name: 'search',
        component: () => import('../components/home/Search.vue')
      },
    ]
  },
  {
    path: '/doc/:docId',
    name: 'doc',
    component: () => import('../views/DocEditView.vue'),
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../components/editor/MindMap.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router