import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import {StoryComponent} from './component/story/story.component';
import {QuizComponent} from './component/quiz/quiz.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'story/:story_id', component: StoryComponent },
    { path: 'quiz/:story_id', component: QuizComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
