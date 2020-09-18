import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

import { AuthGuard } from '../app/guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ConceptosComponent } from './components/catalogos/conceptos/conceptos.component';
import { UsersComponent } from './components/catalogos/users/users.component';
import { ContabilidadComponent } from './components/contabilidad/contabilidad.component';
import { RecursoshumanosComponent } from './components/recursoshumanos/recursoshumanos.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', component:  HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'conceptos', component: ConceptosComponent, canActivate: [AuthGuard]  },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]  },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
  { path: 'conta', component: ContabilidadComponent, canActivate: [AuthGuard]  },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard]  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
