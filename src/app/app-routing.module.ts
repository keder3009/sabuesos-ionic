import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/main-tab/main-tab.module').then(
        (m) => m.MainTabPageModule
      ),
  },
  // {
  //   path: 'verify-email',
  //   loadChildren: () => import('./pages/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }



