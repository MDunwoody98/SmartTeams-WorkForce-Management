import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _f8a9758c = () => interopDefault(import('..\\pages\\admin.vue' /* webpackChunkName: "pages/admin" */))
const _57913f02 = () => interopDefault(import('..\\pages\\dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _1be39454 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _b786ec50 = () => interopDefault(import('..\\pages\\manager.vue' /* webpackChunkName: "pages/manager" */))
const _a706b458 = () => interopDefault(import('..\\pages\\profile.vue' /* webpackChunkName: "pages/profile" */))
const _7279617f = () => interopDefault(import('..\\pages\\team\\_ManagedTeam.vue' /* webpackChunkName: "pages/team/_ManagedTeam" */))
const _140cd1fe = () => interopDefault(import('..\\pages\\worker\\_ManagedWorker.vue' /* webpackChunkName: "pages/worker/_ManagedWorker" */))
const _523bf13d = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _0c89a6d0 = () => interopDefault(import('..\\pages\\_tenant\\dashboard.vue' /* webpackChunkName: "pages/_tenant/dashboard" */))

const emptyFn = () => { }

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _f8a9758c,
    name: "admin"
  }, {
    path: "/dashboard",
    component: _57913f02,
    name: "dashboard"
  }, {
    path: "/login",
    component: _1be39454,
    name: "login"
  }, {
    path: "/manager",
    component: _b786ec50,
    name: "manager"
  }, {
    path: "/profile",
    component: _a706b458,
    name: "profile"
  }, {
    path: "/team/:ManagedTeam?",
    component: _7279617f,
    name: "team-ManagedTeam"
  }, {
    path: "/worker/:ManagedWorker?",
    component: _140cd1fe,
    name: "worker-ManagedWorker"
  }, {
    path: "/",
    component: _523bf13d,
    name: "index"
  }, {
    path: "/:tenant/dashboard",
    component: _0c89a6d0,
    name: "tenant-dashboard"
  }],

  fallback: false
}

export function createRouter(ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push(location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
