import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { setTokenGetter } from '../lib/authBridge'

export default function UseAuthTokenBridge() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  useEffect(() => {
    setTokenGetter(async () => {
      if (!isAuthenticated) return null
      try { return await getAccessTokenSilently() } catch { return null }
    })
  }, [getAccessTokenSilently, isAuthenticated])
  return null
}
