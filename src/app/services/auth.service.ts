import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private url = 'https://cognito-idp.us-east-2.amazonaws.com/';
    private clientId = '15kgev445afv48084b5q26fed1';

    private headers = new HttpHeaders({
        'Content-Type': 'application/x-amz-json-1.1',
        // 'X-Amz-Target': ''
    });


    private sesion: any = null;

    guardarSesion(tokens: any) {
        this.sesion = tokens;
    }

    obtenerSesion() {
        return this.sesion;
    }

    cerrarSesion() {
        this.sesion = null;
    }


    constructor(private http: HttpClient) { }



    registrar(
        email: string,
        password: string,
        nickname: string,
        fechaNacimiento: string
    ): Observable<any> {
        return this.http.post(
            this.url,
            {
                ClientId: this.clientId,
                Username: email,
                Password: password,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: email
                    },
                    {
                        Name: 'nickname',
                        Value: nickname
                    },
                    {
                        Name: 'birthdate',
                        Value: fechaNacimiento
                    }
                ]
            },
            {
                headers: this.headers.set(
                    'X-Amz-Target',
                    'AWSCognitoIdentityProviderService.SignUp'
                )
            }
            
        );
    }

    confirmarRegistro(email: string, codigo: string): Observable<any> {
        return this.http.post(
            this.url,
            {
                ClientId: this.clientId,
                Username: email,
                ConfirmationCode: codigo
            },
            {
                headers: this.headers.set(
                    'X-Amz-Target',
                    'AWSCognitoIdentityProviderService.ConfirmSignUp'
                )
            }
        );
    }

    iniciarSesion(email: string, password: string): Observable<any> {
        return this.http.post(
            this.url,
            {
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: this.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            },
            {
                headers: this.headers.set(
                    'X-Amz-Target',
                    'AWSCognitoIdentityProviderService.InitiateAuth'
                )
            }
        );
    }
}

