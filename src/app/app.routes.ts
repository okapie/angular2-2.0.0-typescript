import {provideRouter, RouterConfig} from '@angular/router';

import {TopRoutes} from './top/top.routes';

export const routes: RouterConfig = [
	...TopRoutes
];

export const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];
