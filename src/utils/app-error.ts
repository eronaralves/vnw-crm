export class AppError {
  detail: string

  constructor(message: string) {
    this.detail = message
  }
}
