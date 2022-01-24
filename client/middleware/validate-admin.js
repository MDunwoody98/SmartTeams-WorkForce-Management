import jwtDecode from 'jwt-decode'
export default async function ({ app, redirect }) {
  // the following look directly for the cookie created by nuxtjs/auth
  // instead of using $auth
  const base64Data = await app.$cookies.get('auth._token.local').split(' ')[1]
  const decodedData = jwtDecode(base64Data)
  if (!decodedData.isAdmin) {
    return redirect('/dashboard')
  }
}
