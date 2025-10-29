import { Injectable } from '@angular/core';

const USER = 'q_user';

@Injectable({
  providedIn: 'root'
})
export class UserStorage {
  saveUser(user: { id: any; role: any }): void {
    try {
      const normalized = {
        id: user?.id ?? '',
        role: (user?.role ?? '').toString().toUpperCase()
      };
      UserStorage.setUser(normalized);
    } catch (e) {
      // no-op: keep method safe in case localStorage is unavailable
    }
  }
  constructor() { }

  static setUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }
  static getUser(): any {
    return JSON.parse(localStorage.getItem(USER));
  }

  static getUserID(): string{
    const user = this.getUser();
    if(user ==null){
      return '';
    }
    return user.id;
  }
   static getUserRole(): string{
    const user = this.getUser();
    if(user ==null){
      return '';
    }
    return user.role;
  }

  static isAdminLoggedIn(): boolean {
    const role:string = this.getUserRole();
    return role == 'ADMIN';
  }

  static isUserLoggedIn(): boolean {
    const role:string = this.getUserRole();
    return role == 'USER';
  }

  static signOut(): void {
    window.localStorage.removeItem(USER);
  }
}
