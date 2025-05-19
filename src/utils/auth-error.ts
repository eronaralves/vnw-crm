export class AuthError extends Error {
  constructor(message: string = 'Token expirado ou inválido.') {
    super(message)
    this.name = 'AuthError'
  }
}
