import {Routes, RouterModule} from "@angular/router";
import {DashboardComponent} from "./worker/dashboard.component";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {AdminAuthGuardService} from "./service/admin-auth-guard.service";

const routes: Routes = [
  {
    path: 'app/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'app',
    component: HomeComponent
  },
  {
    path: 'app/admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AdminAuthGuardService]
  },
  {
    path: '',
    redirectTo: '/app',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
