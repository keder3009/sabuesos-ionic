import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  private readonly AUTHORIZED_EMAILS = [
    'sabuesosapp@gmail.com',
    'keder3009@gmail.com',
    'jhonhelber@gmail.com'
  ];

  constructor() { }

  async canManageAdsAsync(): Promise<boolean> {
    const email = JSON.parse(localStorage.getItem('email') || '{}');

    if (!email) {
      return false;
    }
    return this.AUTHORIZED_EMAILS.includes(email);
  }
}