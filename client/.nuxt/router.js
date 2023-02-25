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
const _e1efefe4 = () => interopDefault(import('..\\pages\\_tenant\\index.vue' /* webpackChunkName: "pages/_tenant/index" */))
const _7f1147ea = () => interopDefault(import('..\\pages\\_tenant\\admin.vue' /* webpackChunkName: "pages/_tenant/admin" */))
const _ff41c8d8 = () => interopDefault(import('..\\pages\\_tenant\\BasePage.vue' /* webpackChunkName: "pages/_tenant/BasePage" */))
const _0c89a6d0 = () => interopDefault(import('..\\pages\\_tenant\\dashboard.vue' /* webpackChunkName: "pages/_tenant/dashboard" */))
const _13296e75 = () => interopDefault(import('..\\pages\\_tenant\\dashboard copy.vue' /* webpackChunkName: "pages/_tenant/dashboard copy" */))
const _58afab25 = () => interopDefault(import('..\\pages\\_tenant\\login.vue' /* webpackChunkName: "pages/_tenant/login" */))
const _43439f2e = () => interopDefault(import('..\\pages\\_tenant\\manager.vue' /* webpackChunkName: "pages/_tenant/manager" */))
const _32c36736 = () => interopDefault(import('..\\pages\\_tenant\\profile.vue' /* webpackChunkName: "pages/_tenant/profile" */))
const _52dab364 = () => interopDefault(import('..\\pages\\_tenant\\team\\_ManagedTeam.vue' /* webpackChunkName: "pages/_tenant/team/_ManagedTeam" */))
const _6f35dc50 = () => interopDefault(import('..\\pages\\_tenant\\worker\\_ManagedWorker.vue' /* webpackChunkName: "pages/_tenant/worker/_ManagedWorker" */))

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
    path: "/:tenant",
    component: _e1efefe4,
    name: "tenant"
  }, {
    path: "/:tenant/admin",
    component: _7f1147ea,
    name: "tenant-admin"
  }, {
    path: "/:tenant/BasePage",
    component: _ff41c8d8,
    name: "tenant-BasePage"
  }, {
    path: "/:tenant/dashboard",
    component: _0c89a6d0,
    name: "tenant-dashboard"
  }, {
    path: "/:tenant/dashboard%20copy",
    component: _13296e75,
    name: "tenant-dashboard copy"
  }, {
    path: "/:tenant/login",
    component: _58afab25,
    name: "tenant-login"
  }, {
    path: "/:tenant/manager",
    component: _43439f2e,
    name: "tenant-manager"
  }, {
    path: "/:tenant/profile",
    component: _32c36736,
    name: "tenant-profile"
  }, {
    path: "/:tenant/team/:ManagedTeam?",
    component: _52dab364,
    name: "tenant-team-ManagedTeam"
  }, {
    path: "/:tenant/worker/:ManagedWorker?",
    component: _6f35dc50,
    name: "tenant-worker-ManagedWorker"
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
