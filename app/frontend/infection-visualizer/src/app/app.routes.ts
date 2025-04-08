import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { InfectionTreeComponent } from './component/infection-tree/infection-tree.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'infection-tree', component: InfectionTreeComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
