import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/index',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
  // 404 page must be placed at the end !!!
]

export const asyncRoutes = [
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/list',
    name: 'exam',
    meta: { authStr: '/exam', title: '考试功能入口', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'examList',
        component: () => import('@/views/exam/examList'),
        meta: { authStr: '/exam/list', title: '考试列表', icon: 'dashboard' }
      },
      {
        path: 'detail',
        name: 'examDetail',
        hidden: true,
        component: () => import('@/views/exam/examDetail'),
        meta: { authStr: '/exam/detail', title: '考试详情', icon: 'dashboard' }
      },
      {
        path: 'answer',
        name: 'answer',
        hidden: true,
        component: () => import('@/views/exam/viewAnswer'),
        meta: {
          authStr: '/exam/answer',
          title: '进入答题页面',
          icon: 'dashboard'
        }
      },
      {
        path: 'record/list',
        name: 'recordList',
        component: () => import('@/views/exam/examRecord'),
        meta: {
          authStr: '/examRecord/list',
          title: '考试列表',
          icon: 'eye-open'
        }
      },
      {
        path: 'record/viewAnswer',
        name: 'viewAnswer',
        hidden: true,
        component: () => import('@/views/exam/viewAnswer'),
        meta: {
          authStr: '/examRecord/view',
          title: '考试记录详情',
          icon: 'eye-open'
        }
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test/examList'),
    hidden: true
  },
  {
    path: '/train',
    name: 'train',
    component: () => import('@/views/train/trainList.vue'),
    hidden: true
  },
  {
    path: '/traindetail',
    name: 'detail',
    component: () => import('@/views/train/trainDetail.vue'),
    hidden: true
  },
  {
    path: '/trainAnswer',
    name: 'answer',
    component: () => import('@/views/train/trainAnswer.vue'),
    hidden: true
  },

  {
    path: '/detail',
    name: 'examDetail',
    component: () => import('@/views/test/examDetail'),
    hidden: true
  },
  {
    path: '/answer',
    name: 'answer',
    component: () => import('@/views/test/viewAnswer'),
    hidden: true
  },

  {
    path: '/question',
    component: Layout,
    redirect: '/question/list',
    name: 'question',
    meta: { authStr: '/question', title: '题库管理', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'questionManager',
        component: () => import('@/views/exam/questionManager'),
        meta: { authStr: '/question/list', title: '题库列表', icon: 'form' }
      }
    ]
  },

  {
    path: '/profe',
    component: Layout,
    redirect: '/user/list',
    name: 'profe',
    meta: { authStr: '/profe', title: '专业类别', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'profeList',
        component: () => import('@/views/exam/profeList'),
        meta: { authStr: '/user/list', title: '专业类别', icon: 'example' }
      }
    ]
  },

  {
    path: '/paper',
    component: Layout,
    redirect: '/paper/list',
    name: 'paper',
    meta: { authStr: '/paper', title: '试卷管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'paperManager',
        component: () => import('@/views/exam/paperManager'),
        meta: { authStr: '/paper/list', title: '试卷列表', icon: 'table' }
      }
    ]
  },
  {
    path: '/trains',
    component: Layout,
    redirect: '/paper/list',
    name: 'paper',
    meta: { authStr: '/paper', title: '培训管理', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'paperManager',
        component: () => import('@/views/exam/trainManager'),
        meta: { authStr: '/paper/list', title: '培训课程', icon: 'table' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    meta: { authStr: '/user', title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/userList'),
        meta: { authStr: '/user/list', title: '用户列表', icon: 'user' }
      }
    ]
  },
  {
    path: '/shift',
    component: Layout,
    redirect: '/user/list',
    name: 'shift',
    meta: { authStr: '/shift', title: '培训班次', icon: 'dashboard' },
    children: [
      {
        path: 'list',
        name: 'shiftList',
        component: () => import('@/views/user/shiftList'),
        meta: { authStr: '/user/list', title: '培训班次', icon: 'dashboard' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
