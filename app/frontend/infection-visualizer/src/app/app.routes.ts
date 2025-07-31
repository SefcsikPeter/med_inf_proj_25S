import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import {StoryComponent} from './component/story/story.component';
import {QuizComponent} from './component/quiz/quiz.component';
import { SettingsComponent } from './component/settings/settings.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'story/:story_id', component: StoryComponent },
    { path: 'quiz/:story_id', component: QuizComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
