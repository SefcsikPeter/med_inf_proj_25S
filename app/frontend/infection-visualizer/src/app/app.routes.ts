import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { InfectionTreeComponent } from './component/infection-tree/infection-tree.component';
import {StoryComponent} from './component/story/story.component';
import {RadialTreeComponent} from './component/radial-tree/radial-tree.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'infection-tree', component: InfectionTreeComponent},
    { path: 'story', component: StoryComponent},
    { path: 'rad-tree', component: RadialTreeComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
