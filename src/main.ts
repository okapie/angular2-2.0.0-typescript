import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { ConcertService } from './app/services/concert.service';

if (process.env.ENV === 'build') {
	enableProdMode();
}

declare var $: JQueryStatic;

bootstrap(AppComponent, [
	HTTP_PROVIDERS,
	ConcertService,
	APP_ROUTER_PROVIDERS
])
.catch(err => console.error(err));
