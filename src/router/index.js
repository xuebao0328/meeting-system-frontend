import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import MeetingListPage from '@/views/MeetingListPage.vue'
import AdminCenter from '@/views/AdminCenter.vue'
import MeetingDetailSettings from '@/views/MeetingDetailSettings.vue'
import BadgePrintSettings from '@/views/BadgePrintSettings.vue'
import SuperAdmin from '@/views/SuperAdmin.vue'
import WebsiteBuilderPage from '@/views/WebsiteBuilderPage.vue'
import UserCenter from '@/views/UserCenter.vue'
import UsersView from '@/views/UsersView.vue'

console.log('UserCenter component:', UserCenter);

Vue.use(Router)

// 修复NavigationDuplicated错误
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta: { requiresAuth: false }
    },
    {
      path: '/meetings',
      name: 'MeetingList',
      component: MeetingListPage,
      meta: { requiresAuth: true }
    },
     {
      path: '/admin-center',
      name: 'AdminCenter',
      component: AdminCenter,
      meta: { requiresAuth: true }
    },
    {
      path: '/meeting/:id/settings',
      name: 'MeetingDetailSettings',
      component: MeetingDetailSettings,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/super-admin',
      name: 'SuperAdmin',
      component: SuperAdmin,
      meta: { requiresAuth: true }
    },
    {
      path: '/website-builder',
      name: 'WebsiteBuilder',
      component: WebsiteBuilderPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/website-builder/professional/:pageId',
      name: 'ProfessionalWebsiteBuilder',
      component: WebsiteBuilderPage,
      props: (route) => ({ 
        isProfessionalVersion: true,
        pageId: route.params.pageId
      }),
      meta: { requiresAuth: true }
    },
    {
      path: '/user-center',
      name: 'UserCenter',
      component: UserCenter,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'Users',
      component: UsersView,
      meta: { requiresAuth: false }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

// 修改路由守卫，将未授权用户重定向到首页而不是登录页
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('token');

  if (requiresAuth && !token) {
    // 重定向到首页，而不是登录页
    next('/');
  } else {
    next();
  }
});

export default router; 