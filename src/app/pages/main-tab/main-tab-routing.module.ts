import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { MainTabComponent } from './main-tab.component';
import { adminAdsGuard } from 'src/app/guards/admin-ads.guard';

const routes: Routes = [
  {
    path: 'main-tab',
    component: MainTabComponent,
    children: [
      {
        path: 'list-reports',
        loadChildren: () =>
          import('../list-reports/list-reports.module').then(
            (m) => m.ListReportsPageModule
          ),
      },
      {
        path: 'extravied',
        loadChildren: () =>
          import('../list-reports/list-reports.module').then(
            (m) => m.ListReportsPageModule
          ),
      },
      {
        path: 'finded',
        loadChildren: () =>
          import('../list-reports/list-reports.module').then(
            (m) => m.ListReportsPageModule
          ),
      },
      {
        path: 'adoptions-list',
        loadChildren: () =>
          import('../list-reports/list-reports.module').then(
            (m) => m.ListReportsPageModule
          ),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('../list-reports/list-reports.module').then(
            (m) => m.ListReportsPageModule
          ),
      },
      {
        path: 'login/:route',
        loadChildren: () =>
          import('../login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'verify-email',
        loadChildren: () =>
          import('../verify-email/verify-email.module').then((m) => m.VerifyEmailPageModule),
      },
      {
        path: 'register/:route',
        loadChildren: () =>
          import('../register/register.module').then(
            (m) => m.RegisterPageModule
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('../auth-page/auth-page.module').then(
            (m) => m.AuthPagePageModule
          ),
      },
      {
        path: 'donations',
        loadChildren: () =>
          import('../donations/donations.module').then(
            (m) => m.DonationsPageModule
          ),
      },
      {
        path: 'view-report/:id/:route',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../view-report/view-report.module').then(
            (m) => m.ViewReportPageModule
          ),
      },
      {
        path: 'map-report/:id',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../map-report/map-report.module').then(
            (m) => m.MapReportPageModule
          ),
      },
      {
        path: 'support',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../support/support.module').then((m) => m.SupportPageModule),
      },
      {
        path: 'create-report-new',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../create-report/create-report.module').then(
            (m) => m.CreateReportPageModule
          ),
      },
      {
        path: 'create-report/:id/:route',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../create-report/create-report.module').then(
            (m) => m.CreateReportPageModule
          ),
      },
      {
        path: 'my-reports',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../my-reports/my-reports.module').then(
            (m) => m.MyReportsPageModule
          ),
      },
      {
        path: 'chat/:idReport/:idChat',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../chat/chat.module').then((m) => m.ChatPageModule),
      },
      {
        path: 'my-favorite/:route',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../my-favorite/my-favorite.module').then(
            (m) => m.MyFavoritePageModule
          ),
      },
      {
        path: 'my-favorite',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../my-favorite/my-favorite.module').then(
            (m) => m.MyFavoritePageModule
          ),
      },
      {
        path: 'search-zone',
        loadChildren: () =>
          import('../search-zone/search-zone.module').then(
            (m) => m.SearchZonePageModule
          ),
      },
      {
        path: 'my-chats',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../my-chats/my-chats.module').then(
            (m) => m.MyChatsPageModule
          ),
      },
      {
        path: 'notifications',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../notifications/notifications.module').then(
            (m) => m.NotificationsPageModule
          ),
      },
      {
        path: 'create-report',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../create-report/create-report.module').then(
            (m) => m.CreateReportPageModule
          ),
      },
      {
        path: 'recovery-password/:route',
        loadChildren: () =>
          import('../recovery-password/recovery-password.module').then(
            (m) => m.RecoveryPasswordPageModule
          ),
      },
      {
        path: 'notification',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../notifications/notifications.module').then(
            (m) => m.NotificationsPageModule
          ),
      },
      {
        path: 'organization-form/:route',
        loadChildren: () =>
          import('../organization-form/organization-form.module').then(
            (m) => m.OrganizationFormPageModule
          ),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'adoptions',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../adoptions-form/adoptions-form.module').then(
            (m) => m.AdoptionsFormPageModule
          ),
      },
      {
        path: 'log-out',
        loadChildren: () =>
          import('../log-out/log-out.module').then(
            (m) => m.LogOutPageModule),
      },
      {
        path: 'admin-ads',
        canActivate: [adminAdsGuard],
        loadChildren: () =>
          import('../app-admin-ads/app-admin-ads.module').then(
            (m) => m.AdminAdsPageModule),
      },
      {
        path: '',
        redirectTo: 'main-tab/list-reports',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/main-tab/list-reports',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTabPageRoutingModule { }
