import {RouterConfig} from '@angular/router';
import {TopComponent} from './top.component';
import { ConcertDetailComponent } from '../concert/concert-detail.component';

export const TopRoutes: RouterConfig = [
	{ path: '', component: TopComponent },
	{ path: 'concert/:id', component: ConcertDetailComponent }
];
