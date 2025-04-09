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

console.log('UserCenter component:', UserCenter);

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/meetings',
      name: 'MeetingList',
      component: MeetingListPage
    },
     {
      path: '/admin-center',
      name: 'AdminCenter',
      component: AdminCenter
    },
    {
      path: '/meeting/:id/settings',
      name: 'MeetingDetailSettings',
      component: MeetingDetailSettings,
      props: true,
    },
    {
      path: '/super-admin',
      name: 'SuperAdmin',
      component: SuperAdmin
    },
    {
      path: '/website-builder',
      name: 'WebsiteBuilder',
      component: WebsiteBuilderPage
    },
    {
      path: '/website-builder/professional/:pageId',
      name: 'ProfessionalWebsiteBuilder',
      component: WebsiteBuilderPage,
      props: (route) => ({ 
        isProfessionalVersion: true,
        pageId: route.params.pageId
      })
    },
    {
      path: '/user-center',
      name: 'UserCenter',
      component: UserCenter
    },
    // {
    //   path: '/preview/:meetingId/:pageId',
    //   name: 'EnhancedPreviewPage',
    //   component: EnhancedPreviewPage,
    //   props: true
    // }
  ]
}) 