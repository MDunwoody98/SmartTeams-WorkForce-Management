export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'SmartTeams - Time Management System',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  layoutTransition: {
    name: 'home',
    mode: 'out-in',
  },
  pageTransition: {
    name: 'home',
    mode: 'out-in',
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: {
    dirs: [
      '~/components',
      '~/components/Dashboard-Components',
      '~/components/Dashboard-Components/DayView-Components',
    ],
  },
  /*
   ** Nuxt.js dev-modules
   ** See https://nuxtjs.org/api/configuration-modules/#buildmodules
   */
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://nuxtjs.org/api/configuration-modules/
    '@nuxtjs/auth-next',
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
  ],
  // auth setup
  auth: {
    redirect: {
      login: '/login', // User will be redirected to this path if login is required
      logout: '/', // User will be redirected to this path if after logout
      callback: false, // User will be redirected to this path by the identity provider after login
      home: '/dashboard', // User will be redirected to this path after login
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token', // property - which field of response JSON to use as token
          maxAge: 1800, // 30 minutes
          global: true, // Auth token used on all axios requests
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token', // property name in request
          maxAge: 60 * 60 * 24 * 30, // 30 days
          tokenRequired: true,
        },
        user: {
          property: 'user', // <--- Default "user"
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/auth/logout', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' }, // this.$auth.refreshTokens() to manually refresh
          user: { url: '/auth/user', method: 'get', propertyName: false },
        },
        redirect: {
          login: '/login', // User will be redirected to this path if login is required
          logout: '/', // User will be redirected to this path if after logout
          callback: false, // User will be redirected to this path by the identity provider after login
          home: '/dashboard', // User will be redirected to this path after login
        },
        // autologout is false
      },
    },
  },
  axios: {
    // proxyHeaders: false
    baseURL: 'http://127.0.0.1:9000/api',
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    /*
     ** You can extend webpack config here
     */
  },
  router: {
    // Always redirect user to /login page if loggedIn is false
    middleware: ['auth'],
  },
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: '#091C58',
          secondary: '#3B8070',
        },
        dark: {
          primary: '#091C58',
          secondary: '#3B8070',
        },
      },
    },
    defaultAssets: {
      font: true,
      icons: 'md',
    },
    icons: {
      iconfont: 'md',
    },
  },
  eslint: {
    rules: {
      'no-console': 'off',
    },
  },
}
