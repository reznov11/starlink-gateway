import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UUIDTypes } from 'uuid';

export interface UserProfile {
  id: UUIDTypes;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  job_title?: string;
  location?: string;
  birth_date?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessTokenKey: string = 'iframe_generator_access_token';

  public currentUserSubject: BehaviorSubject<string | null>;
  public currentUser$: Observable<string | null>;

  public userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string | null>(
      localStorage.getItem(this.accessTokenKey)
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public login(email: string, password: string): Observable<string> {
    return this.http.post<any>('/login/', { email, password }).pipe(
      tap((response: any) => {
        const accessToken = response.token;
        localStorage.setItem(this.accessTokenKey, accessToken);
        this.currentUserSubject.next(accessToken);
      }),
      map((response: any) => response.token)
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return null if the user was logged out successfully.
   */
  public logout(): Observable<HttpResponse<any>> {
    return this.http.post('/logout/', {}, { observe: 'response' }).pipe(
      tap(() => {
        this.cleanToken();
      })
    );
  }

  public fetchUserProfile(): Observable<UserProfile> {
    return this.http.post<UserProfile>('/user/profile/', {}).pipe(
      tap((profile) => {
        this.userProfileSubject.next(profile);
      })
    );
  }

  public fetchUserRoles(): Observable<any> {
    return this.http.post('/user/roles/', {});
  }

  public cleanToken(): void {
    localStorage.removeItem(this.accessTokenKey);
    this.currentUserSubject.next(null);
    this.userProfileSubject.next(null);
  }

  get currentUserValue(): string | null {
    return this.currentUserSubject.value;
  }

  get currentUserProfile(): UserProfile | null {
    return this.userProfileSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  public getUserRole(): string {
    return this.currentUserProfile?.role! || '';
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }
}
