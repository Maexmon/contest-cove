// basic service
import { Injectable } from '@angular/core';

// environment
import { environment } from '../environments/environment';

// http
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError} from 'rxjs'

// services
import { ErrorHandlerService } from './error-handler.service';

// interfaces
import { SignUpRequest } from './sign-up-request';
import { SignUpResponse } from './sign-up-response';

import { SignInRequest } from './sign-in-request';
import { SignInResponse } from './sign-in-response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  signUp(signUpRequest: SignUpRequest): Observable<HttpResponse<SignUpResponse>> {
    return this.http.post<SignUpResponse>(environment.manager + "/sign-up/", signUpRequest, { observe: "response" })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.errorHandlerService.handleHttpError(error)
      ));
  }

  signIn(signInRequest: SignInRequest): Observable<HttpResponse<SignInResponse>> {
    return this.http.post<SignInResponse>(environment.manager + "/sign-in/", signInRequest, { observe: "response" })
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.errorHandlerService.handleHttpError(error)
      ));
  }
}