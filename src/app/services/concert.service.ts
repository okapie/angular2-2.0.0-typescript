import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class ConcertService {
	private baseConcertUrl = 'http://127.0.0.1:2050/concertList';

	constructor(
		private http: Http
	) {}

	getAllConcerts = (): Observable<Response> => {
		const headers = new Headers({
			'Content-Type': 'application/json'
		});
		const options = new RequestOptions({ headers: headers });
		return this.http.get(this.baseConcertUrl, options);
	};

}
