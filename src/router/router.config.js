/**
 * 基础路由
 * @type { *[] }
 */
export const routerMap = [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/',
      name: "首页",
      component: () => import('../views/index.vue'),
      // redirect: '/index',
    },
    // {
    //     path: "/book-shell",
    //     name: "书架",
    //     component: () => import(/* webpackChunkName: "user" */ '@/views/bookShell'),
    // },
    {
        path: "/book-view",
        name: "书籍阅读",
        component: () => import('../views/bookView.vue')
    }
  ]