import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = "https://identitytoolkit.googleapis.com/v1/accounts";
  private apikey: string = environment.apiKey;
  userToken: string;
  constructor(private http: HttpClient) { }
  
  login(user:UserModel){
    const authData = {
      ...user,
      returnSecureToken: true
    };

    
    return this.http.post(`${this.url}:signInWithPassword?key=${this.apikey}`,
      authData).pipe(
        map(resp => {
          this.saveToken(resp['idToken']);
          return resp;
        })
      );;
  }
  

  isAuthenticated(): boolean {
    if(this.userToken.length < 2){
      return false;
    }
    
    const expires = Number(localStorage.getItem('expires'));
    const expireDate = new Date();
    expireDate.setTime(expires);
    
    if(expireDate > new Date()){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    localStorage.removeItem('idToken');
  }

  signIn(user:UserModel){
    const authData = {
      ...user,
      returnSecureToken: true
    };
 
    return this.http.post(`${this.url}:signUp?key=${this.apikey}`,
      authData).pipe(
        map(resp => {
          this.saveToken(resp['idToken']);
          return resp;
        })
      );
  }
  
  private saveToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('token',idToken);

    let today = new Date();
    today.setSeconds(3600);

    localStorage.setItem('expires', today.getTime().toString());

  }
  
  readToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }
}
