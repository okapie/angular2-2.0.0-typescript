import { RouterConfig } from '@angular/router';
import { ConcertDetailComponent } from '../concert/concert-detail.component';

export const ConcertsRoutes: RouterConfig = [
	{ path: 'concert', component: ConcertDetailComponent },
	{ path: 'concert/:id', component: ConcertDetailComponent }
];
