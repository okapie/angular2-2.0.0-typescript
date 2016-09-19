import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConcertService } from '../services/concert.service';
import { DateService } from '../services/date.service';

@Component({
	selector   : 'my-concert-list',
	templateUrl: './concert-detail.component.html',
	providers  : [DateService]
})

export class ConcertDetailComponent implements OnInit {

	private submitted = false;
	private active = true;
	private selectedId: number;
	private model;

	constructor(
		private concertService: ConcertService,
		private dateService: DateService,
		private location: Location,
		private route: ActivatedRoute) {
			this.model = {
				concertTitle: '',
				concertImage: '',
				concertAlt: '',
				deadlineInfo: '',
				tempDeadLineDate: '',
				concertDate: '',
				city: ''
			};
	}

	ngOnInit() {

		this.selectedId = +this.route.params['_value'].id;
		let getIndex: number;

		this.concertService.getAllConcerts()
			.subscribe(
			res => {
				res.json().forEach((item, index) => {
					if ((this.selectedId) === item.id) {
						getIndex = index;
						this.model.concertTitle = item.concert_name;
						this.model.concertImage = item.concert_image_url;

						let currentFullDate = new Date();
						let currentYear = currentFullDate.getFullYear();
						let currentMonth = currentFullDate.getMonth();
						let currentDate = currentFullDate.getDate();
						let currentHour = currentFullDate.getHours();
						let currentMinute = currentFullDate.getMinutes();

						let getConcertUTCTime = new Date(item.concert_places.event_date);
						this.dateService.getUTCTime(getConcertUTCTime);
						let concertYear = getConcertUTCTime.getFullYear();
						let concertMonth = getConcertUTCTime.getMonth() + 1;
						let concertDay = getConcertUTCTime.getDate();

						let getEndConcertUTCTime = new Date(item.concert_places.event_end_time);
						this.dateService.getUTCTime(getEndConcertUTCTime);
						let endConcertYear = getEndConcertUTCTime.getFullYear();
						let endConcertMonth = getEndConcertUTCTime.getMonth() + 1;
						let endConcertDay = getEndConcertUTCTime.getDate();
						let hour = +getEndConcertUTCTime.getHours();
						let min = +getEndConcertUTCTime.getMinutes();
						let hourStr: string;
						let minStr: string;
						if (hour < 10) {
							hourStr = `0${hour}`;
						} else {
							hourStr = hour.toString();
						}
						if (min < 10) {
							minStr = `0${min}`;
						} else {
							minStr = min.toString();
						}

						let tempDate = `${concertYear}/${concertMonth}/${concertDay}`;
						let tempDeadLineDate = `${endConcertYear}/${endConcertMonth}/${endConcertDay} ${hourStr}:${minStr}`;

						if (currentYear > endConcertYear) {
							this.model.deadlineInfo = ' Already closed applications...';
							this.model.tempDeadLineDate = '';
						}

						if (currentYear === endConcertYear) {
							if (currentMonth > endConcertMonth) {
								this.model.deadlineInfo = ' Already closed applications...';
								this.model.tempDeadLineDate = '';
							} else if (currentMonth < endConcertMonth) {
								this.model.deadlineInfo = '';
								this.model.tempDeadLineDate = tempDeadLineDate;
							} else if (currentMonth === endConcertMonth) {
								if (currentDate > endConcertDay) {
									this.model.deadlineInfo = ' Already closed applications...';
									this.model.tempDeadLineDate = '';
								} else {
									this.model.deadlineInfo = '';
									this.model.tempDeadLineDate = tempDeadLineDate;
								}
								if (currentDate === endConcertDay) {
									if (currentHour > hour || currentMinute > min) {
										this.model.deadlineInfo = ' Already closed applications...';
										this.model.tempDeadLineDate = '';
									} else {
										this.model.deadlineInfo = '';
										this.model.tempDeadLineDate = tempDeadLineDate;
									}
								}
							}
						}
						this.model.concertDate = tempDate;
						this.model.city = item.concert_places.concert_place;
					}
				});
			},
			error => {
				alert('Reading data is failed.');
			}
		);
	}

	goBack = () => {
		this.location.go('/');
		window.location.reload();
	};
}
