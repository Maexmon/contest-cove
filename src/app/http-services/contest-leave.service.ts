// basic service
import { Injectable } from '@angular/core';

// environment
import { environment } from '../../environments/environment';

// http
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

// services
import { ErrorHandlerService } from '../internal-services/error-handler.service';

// interfaces
import { ContestLeaveResponse } from '../interfaces/contest-leave-response';

@Injectable({
  providedIn: 'root'
})
export class ContestLeaveService {

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  leaveContest(contestId: string, userId: string): Observable<HttpResponse<ContestLeaveResponse>> {
    return this.http.delete<ContestLeaveResponse>(environment.manager + "/contest-leave/" + contestId + "/" + userId, { observe: "response"})
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.errorHandlerService.handleHttpError(error)
      ));
  }
}
