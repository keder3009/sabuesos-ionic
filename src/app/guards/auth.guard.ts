import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private alertService: AlertService, private authService: AuthService) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    Promise<boolean | UrlTree> {
    if (!await this.authService.isLoggedIn()) {
      this.alertService.infoAlert('Debe loggearse para acceder a esta opción.');
      this.router.navigate(['main-tab/auth']);
      return false;
    }
    return true;

  }
}
