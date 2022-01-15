/* eslint-disable no-unused-vars */
export function InvalidException(this: any): void {
  this.status = 406;
  this.message = 'Invalid credentials';
}

export function NotFoundException(this: any): void {
  this.status = 403;
  this.message = 'Please login or create an account';
}

export function UnauthorizedException(this: any): void {
  this.status = 401;
  this.message = 'You are not authorized';
}

export function CustomException(
  this: any,
  code: number,
  message: string
): void {
  this.status = code;
  this.message = message;
}
