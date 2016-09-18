import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import '../style/app.scss';

@Component({
	selector: 'my-app',
	directives: [...ROUTER_DIRECTIVES],
	template: require('./app.component.html'),
	styleUrls: ['./app.component.scss']
})

export class AppComponent {}
