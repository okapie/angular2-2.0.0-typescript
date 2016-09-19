import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';

import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
/*import { InMemoryDataService } from './in-memory-data.service';*/
import { Concert } from './concert/concert'

import './rxjs-extensions';
import { AppComponent } from './app.component';
import { routing, routedComponents } from './app.routing';
import { ConcertService } from './services/concert.service';
import { TopComponent } from './top/top.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		routing,
		HttpModule
	],
	declarations: [
		AppComponent,
		TopComponent,
		routedComponents
	],
	providers: [
		ConcertService,
		{ provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
		{ provide: SEED_DATA, useClass: Concert }     // in-mem server data
	],
	bootstrap: [AppComponent]
})
export class AppModule { }