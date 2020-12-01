import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'sign-in',
    redirectTo: 'sign-in',
    pathMatch: 'full'

  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'sign-in',
    loadChildren: './pages/sign-in/sign-in.module#SignInPageModule'
  },
  {
    path: 'sign-up',
    loadChildren: './pages/sign-up/sign-up.module#SignUpPageModule'
  },
  {
    path: 'activation',
    loadChildren: './pages/activation/activation.module#ActivationComponentModule'
  },
  {
    path: 'abonnes',
    loadChildren: './pages/abonnes/abonnes.module#AbonnesPageModule'
  },
  {
    path: 'rapports',
    loadChildren: './pages/rapports/rapports.module#RapportsPageModule'
  },
  {
    path: 'categories',
    loadChildren: './pages/categories/categories.module#CategoriesPageModule'
  },
  {
    path: 'factures',
    loadChildren: './pages/factures/factures.module#FacturesPageModule'
  },
  {
    path: 'notifications',
    loadChildren: './pages/notifications/notifications.module#NotificationsPageModule'
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule'
  },
  {
    path: 'users',
    loadChildren: './pages/users/users.module#UsersPageModule'
  },
  {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule'
  }
  // { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  // { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
