import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment'
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs-compat/add/operator/takeUntil';
import * as _ from "lodash";
import { ToastrService } from 'ngx-toastr';
import * as bcrypt from 'bcryptjs';
import { Base64 } from 'js-base64';
//

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$: BehaviorSubject<any> = new BehaviorSubject(null);
  private authState$: BehaviorSubject<any> = new BehaviorSubject(false);
  private signingOut$: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.currentUser$.next(this.getCurrentUser());
    this.authState$.next(this.isLoggedIn());
    this.signingOut$.next(this.isSigningOut());
  }

  // Regresa el estado de si esta loggeado o no, pero como observer
  public isAuthenticated(): any {
    return this.authState$;
  }

  // Regresa cualquier cambio en el objeto de usuario, como observer
  public user(): any {
    return this.currentUser$;
  }

  // Regresa el usuario actual obtenido del local storage
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    const jwtToken = localStorage.getItem('jwtToken');
    if (!user || !jwtToken) {
      return false;
    }
    return JSON.parse(user);
  }

  // Regresa si esta o no logeado actualmente a modo de estatico
  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  login(emailuser: any, passworduser: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    
    let passwordEnc = this.encrypPassword(passworduser);
  
    console.log("passwordEnc:", passwordEnc)

    return this.http.post(environment.api_url + '/authuser/signin', { emailuser, passwordEnc })
      .pipe(map((user: any) => {
        if (!user.success) { this.logout(); return Promise.reject(user); }
        localStorage.setItem('jwtToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser$.next(user);
        this.authState$.next(user.success);
        this.signingOut$.next(!user.success);
        return user;
      }, (error: any) => {
        this.logout();
      }));
  }

  register(dataIn: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const dataUser = {
      emailuser: _.get(dataIn, 'emailuser'),
      nameuser: _.get(dataIn, 'nameuser'),
      passworduser: this.encrypPassword(_.get(dataIn, 'password')),
      typeiduser: _.get(dataIn, 'typeiduser')
    }

    console.log('dataUser:', dataUser);
    return this.http.post(environment.api_url + '/authuser/signup', dataUser)
      .pipe(map((user: any) => {
        if (!user.success) { this.logout(); return Promise.reject(user) };
        localStorage.setItem('jwtToken', user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser$.next(user);
        this.authState$.next(user.success);
        this.signingOut$.next(!user.success);
        return user;
      }, (error: any) => {
        this.logout();
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwtToken');
    this.currentUser$.next(null);
    this.authState$.next(false);
    this.signingOut$.next(true);
  }

  isSigningOut() {
    return this.signingOut$;
  }

  profile() {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'token': localStorage.getItem('jwtToken')
        })
      };
      return this.http.get(environment.api_url + '/authuser/profile', httpOptions)
        .pipe(first())
        .subscribe((user: any) => {
          this.toastr.success('Hello: Welcome ' + _.get(user.data[0], 'nameuser'), 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
          return user;
        }, error => {
          this.logout();
          this.toastr.success('Hello: Welcome, register or log in.', 'Aviso de Angular 9', {
            timeOut: 10000,
            positionClass: 'toast-bottom-right'
          });
        });
    } catch (e) {
      console.log('error profile: ', e)
    }
  }
  
  encrypPassword (password: string) {
    try{
     return Base64.encode(password); 
    } catch (e) {
        console.log('Encryption error (encrypPassword)', e);   
        return 'Encryption error (encrypPassword).';
    }
 };
}
