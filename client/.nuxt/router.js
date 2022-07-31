import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _cd6ed354 = () => interopDefault(import('..\\pages\\admin.vue' /* webpackChunkName: "pages/admin" */))
const _4a4ec39b = () => interopDefault(import('..\\pages\\dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _3180e570 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _706bf818 = () => interopDefault(import('..\\pages\\manager.vue' /* webpackChunkName: "pages/manager" */))
const _5febc020 = () => interopDefault(import('..\\pages\\profile.vue' /* webpackChunkName: "pages/profile" */))
const _0509bde3 = () => interopDefault(import('..\\pages\\team\\_ManagedTeam.vue' /* webpackChunkName: "pages/team/_ManagedTeam" */))
const _5305bd36 = () => interopDefault(import('..\\pages\\worker\\_ManagedWorker.vue' /* webpackChunkName: "pages/worker/_ManagedWorker" */))
const _67d94259 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _c1cbf998 = () => interopDefault(import('..\\pages\\_tenant\\dashboard.vue' /* webpackChunkName: "pages/_tenant/dashboard" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _cd6ed354,
    name: "admin"
  }, {
    path: "/dashboard",
    component: _4a4ec39b,
    name: "dashboard"
  }, {
    path: "/login",
    component: _3180e570,
    name: "login"
  }, {
    path: "/manager",
    component: _706bf818,
    name: "manager"
  }, {
    path: "/profile",
    component: _5febc020,
    name: "profile"
  }, {
    path: "/team/:ManagedTeam?",
    component: _0509bde3,
    name: "team-ManagedTeam"
  }, {
    path: "/worker/:ManagedWorker?",
    component: _5305bd36,
    name: "worker-ManagedWorker"
  }, {
    path: "/",
    component: _67d94259,
    name: "index"
  }, {
    path: "/:tenant/dashboard",
    component: _c1cbf998,
    name: "tenant-dashboard"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
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
