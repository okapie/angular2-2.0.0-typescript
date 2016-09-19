import { Routes, RouterModule } from '@angular/router';

import { TopComponent } from './top/top.component';
import { ConcertDetailComponent } from './concert/concert-detail.component';

const appRoutes: Routes = [
	{
		path: '',
		redirectTo: '/top',
		pathMatch: 'full'
	},
	{
		path: 'top',
		component: TopComponent
	},
	{
		path: 'detail/:id',
		component: ConcertDetailComponent
	}
];

export const routing = RouterModule.forRoot(appRoutes);

export const routedComponents = [TopComponent, ConcertDetailComponent];
