import { HttpErrorResponse } from '@angular/common/http';

const MENSAJES: Record<string, string> = {
  NotAuthorizedException: 'Correo o contraseña incorrectos.',
  UserNotFoundException: 'Correo o contraseña incorrectos.',
  UserNotConfirmedException: 'Tu cuenta todavía no fue confirmada. Revisá tu correo.',
  UsernameExistsException: 'Ya existe una cuenta con ese correo.',
  CodeMismatchException: 'El código ingresado no es correcto.',
  ExpiredCodeException: 'El código venció. Solicitá uno nuevo.',
  InvalidPasswordException: 'La contraseña no cumple los requisitos de seguridad.',
  InvalidParameterException: 'Revisá los datos ingresados.',
  LimitExceededException: 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.',
  TooManyRequestsException: 'Demasiados intentos. Esperá unos minutos e intentá de nuevo.'
};

export function mensajeErrorCognito(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No hay conexión. Revisá tu internet e intentá nuevamente.';
  }

  const tipo = String(error.error?.__type ?? '').split('#').pop() ?? '';

  return MENSAJES[tipo] ?? 'No se pudo completar la operación. Intentá nuevamente.';
}