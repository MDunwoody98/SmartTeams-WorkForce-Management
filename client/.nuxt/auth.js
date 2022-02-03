import Middleware from './middleware'
import { Auth, authMiddleware, ExpiredAuthSessionError } from '~auth/runtime'

// Active schemes
import { RefreshScheme } from '~auth/runtime'

Middleware.auth = authMiddleware

export default function (ctx, inject) {
  // Options
  const options = {
  "resetOnError": false,
  "ignoreExceptions": false,
  "scopeKey": "scope",
  "rewriteRedirects": true,
  "fullPathRedirect": false,
  "watchLoggedIn": true,
  "redirect": {
    "login": "/login",
    "logout": "/",
    "home": "/dashboard",
    "callback": false
  },
  "vuex": {
    "namespace": "auth"
  },
  "cookie": {
    "prefix": "auth.",
    "options": {
      "path": "/"
    }
  },
  "localStorage": {
    "prefix": "auth."
  },
  "defaultStrategy": "local"
}

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Register strategies
  // local
  $auth.registerStrategy('local', new RefreshScheme($auth, {
  "token": {
    "property": "access_token",
    "maxAge": 1800,
    "global": true
  },
  "refreshToken": {
    "property": "refresh_token",
    "data": "refresh_token",
    "maxAge": 2592000,
    "tokenRequired": true
  },
  "user": {
    "property": "user",
    "autoFetch": true
  },
  "endpoints": {
    "login": {
      "url": "/auth/login",
      "method": "post",
      "propertyName": "token"
    },
    "logout": {
      "url": "/auth/logout",
      "method": "post"
    },
    "refresh": {
      "url": "/auth/refresh",
      "method": "post"
    },
    "user": {
      "url": "/auth/user",
      "method": "get",
      "propertyName": false
    }
  },
  "redirect": {
    "login": "/login",
    "logout": "/",
    "callback": false,
    "home": "/dashboard"
  },
  "name": "local"
}))

  // Inject it to nuxt context as $auth
  inject('auth', $auth)
  ctx.$auth = $auth

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.client) {
      // Don't console log expired auth session errors. This error is common, and expected to happen.
      // The error happens whenever the user does an ssr request (reload/initial navigation) with an expired refresh
      // token. We don't want to log this as an error.
      if (error instanceof ExpiredAuthSessionError) {
        return
      }

      console.error('[ERROR] [AUTH]', error)
    }
  })
}
