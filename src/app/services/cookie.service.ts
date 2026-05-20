import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }
  
  deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }
}
