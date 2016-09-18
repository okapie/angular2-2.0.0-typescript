import { Injectable } from '@angular/core';

@Injectable()

export class DateService {
	getUTCTime = (time) => {
		return time.setTime(
			time.getTime() - (time.getTimezoneOffset() * 60 * 1000)
		);
	};
}
