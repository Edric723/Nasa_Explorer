// URL de la API de Cognito para solicitudes HTTP directas
export const COGNITO_URL =
  'https://cognito-idp.us-east-2.amazonaws.com/';

// Identificador del cliente de aplicación
export const COGNITO_CLIENT_ID =
  '15kgev445afv48084b5q26fed1';

// Emisor de tokens de la User Pool
export const COGNITO_AUTHORITY =
  'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_gHuFLW2f3';

// Dominio web de Cognito
export const COGNITO_DOMINIO =
  'https://us-east-2ghuflw2f3.auth.us-east-2.amazoncognito.com';

// Encabezados para solicitudes HTTP a la API de Cognito
export const COGNITO_HEADERS = {
  'Content-Type': 'application/x-amz-json-1.1'
};

// Clave para almacenar la sesión en el navegador
export const STORAGE_KEYS = {
  SESION: 'nasa_explorer_sesion'
};


// Por el momento la sesiòn se guarda en el localstorage, para testear en formato web.
// Hay q revisar luego cuando pasemos a android dònde guardar los datos de sesiòn para mantener la misma andando.