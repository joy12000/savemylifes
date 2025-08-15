let tokenGetter: null | (() => Promise<string | null>) = null
export function setTokenGetter(fn: () => Promise<string | null>) { tokenGetter = fn }
export async function getToken() { return tokenGetter ? await tokenGetter() : null }
