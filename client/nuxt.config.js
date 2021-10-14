export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
 mode: 'universal',
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
    title: process.env.npm_package_name || '',
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
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   ** See https://nuxtjs.org/api/configuration-modules/#buildmodules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://nuxtjs.org/api/configuration-modules/
    'nuxt-oauth',
    '@nuxtjs/axios',
  ],
  oauth: {
    sessionName: 'mySession',
    secretKey: process.env.SECRET_KEY || 'SECRET_KEY',
    oauthHost: process.env.OAUTH_HOST || 'OAUTH_HOST',
    oauthClientID: process.env.OAUTH_CLIENT_ID || 'OAUTH_CLIENT_ID',
    oauthClientSecret: process.env.OAUTH_CLIENT_SECRET || 'OAUTH_CLIENT_SECRET',
    onLogout: (req, res) => {
      // do something after logging out
    },
    fetchUser: (accessToken, request) => {
      // do something to return the user
    },
  },
  axios: {
    // proxyHeaders: false
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
}
