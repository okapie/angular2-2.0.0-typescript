import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Concert } from '../concert/concert';
import { ConcertService } from '../services/concert.service';
import { DateService } from '../services/date.service';

declare var jQuery: JQueryStatic;

@Component({
	selector: 'my-concerts',
	template:  require('./top.component.html'),
	providers: [ConcertService, DateService]
})
export class TopComponent implements OnInit {

	private active = true;
	private submitted = false;
	private model;
	private selectedId: number;
	private concert: Concert;
	private getNextConcerts: Array<any> = [];
	private getCurrentConcerts: Array<any> = [];
	private getPastConcerts: Array<any> = [];
	private getOnlyPastConcerts: Array<any> = [];
	private cityArray: Array<any> = [];
	private concertArray: Array<any> = [];
	private concertIdArray: Array<any> = [];
	private concertTitleArray: Array<string> = [];
	private imgGetPathArray: Array<any> = [];
	private inputTarget = {
		index: [],
		concert: []
	};
	private yearMonthArray: Array<any> = [];

	constructor(
		private concertService: ConcertService,
		private dateService: DateService,
		private router: Router) {
			this.model = {
				errorMsg: '',
				id: [],
				concert_places: {
					concert_place: [],
					event_date: [],
					event_end_info: [],
					event_end_time: []
				},
				showCurrentYearMonth: ''
			};
	}

	isSelected(concert: Concert) {
		return concert.id === this.selectedId;
	}

	ngOnInit() {

		this.yearMonthArray.push([{
			thisYear: '',
			thisMonth: '',
			pastYear: '',
			pastMonth: ''
		}]);
		let currentYearMonth = new Date();
		if (currentYearMonth.getFullYear() >= 2000) {
			this.yearMonthArray[0].thisYear = currentYearMonth.toLocaleDateString().split('/')[0];
			this.yearMonthArray[0].thisMonth = currentYearMonth.toLocaleDateString().split('/')[1];
		} else {
			this.yearMonthArray[0].thisYear = currentYearMonth.toLocaleDateString().split('/')[0];
			this.yearMonthArray[0].thisMonth = currentYearMonth.toLocaleDateString().split('/')[1];
		}

		jQuery('.result-table').css('display', 'block');
		this.getCurrentConcerts = [];
		this.getPastConcerts = [];
		this.getNextConcerts = [];
		this.concertTitleArray = [];
		this.cityArray = [];
		this.model.id = [];
		this.concertIdArray = [];
		this.concertService.getAllConcerts()
			.subscribe(
			res => {
				this.concertArray = res.json();
				this.concertArray.forEach((item) => {
					this.cityArray.push(<Concert>item.concert_places);
					this.model.id = item.id;
					this.concertIdArray.push([{
						id: item.id.toString(),
						name: item.concert_name
					}]);

					let getConcertUTCTime = new Date(item.concert_places.event_date);
					this.dateService.getUTCTime(getConcertUTCTime);
					let concertYear = getConcertUTCTime.getFullYear();
					let concertMonth = getConcertUTCTime.getMonth() + 1;
					let concertDay = getConcertUTCTime.getDate();

					let tempDate = concertYear + '/' + concertMonth + '/' + concertDay;

					let elm = [{
						date: tempDate,
						place: item.concert_places.concert_place,
						title: item.concert_name,
						path: item.title.logo_image_url
					}];

					let numThisYear = Number(this.yearMonthArray[0].thisYear);
					let numThisMonth = Number(this.yearMonthArray[0].thisMonth);

					if (numThisYear < concertYear) {
					} else if (numThisYear === concertYear) {
						if (numThisMonth > concertMonth) {
							this.getPastConcerts.push(elm);
						} else if (numThisMonth === concertMonth) {
							this.getCurrentConcerts.push(elm);
							this.model.showCurrentYearMonth = numThisYear + '/' + numThisMonth;
						} else if (numThisMonth < concertMonth) {
							this.getNextConcerts.push(elm);
						}
					} else if (numThisYear > concertYear) {
						this.getPastConcerts.push(elm);
					}
				});

				if (this.getCurrentConcerts.length > 0) {
					jQuery('.current-month-list').css('display', 'block');
				} else {
					jQuery('.current-month-list').css('display', 'none');
				}

				if (this.getPastConcerts.length > 0) {
					jQuery('.past-concert-list').css('display', 'block');
				} else {
					jQuery('.past-concert-list').css('display', 'none');
				}

				if (this.getNextConcerts.length > 0) {
					jQuery('.future-list').css('display', 'block');
				} else {
					jQuery('.future-list').css('display', 'none');
				}
			},
			error => {
				alert('Reading data is failed.');
			}
		);
	}

	setSelect = (target, concert: Concert, i) => {
		this.submitted = true;
		if (jQuery(target).prop('checked') === true) {
			this.inputTarget.index.push(i);
			this.inputTarget.concert.push(concert);
		} else {
			if (this.inputTarget.index.length > 0) {
				this.inputTarget.index.forEach((item, ind) => {
					if (i === item) {
						this.inputTarget.index.splice(ind, 1);
						this.inputTarget.concert.splice(ind, 1);
					}
				});
			}
		}
	};

	getSelected = (target) => {
		this.getCurrentConcerts = [];
		this.getPastConcerts = [];
		this.getNextConcerts = [];
		this.imgGetPathArray = [];
		this.concertTitleArray = [];
		this.cityArray = [];
		this.model.id = [];
		this.concertIdArray = [];
		this.inputTarget.concert.forEach((selected) => {
			this.concert = selected;
			this.concertArray.forEach((item) => {
				if ((item.id.toString()).indexOf(this.concert.id.toString()) >= 0) {
					this.cityArray.push(<Concert>item.concert_places);
					this.model.id = this.concert.id;
					this.concertTitleArray.push(item.concert_name);
					this.concertIdArray.push([{
						id:   this.model.id.toString(),
						name: item.concert_name
					}]);
					this.imgGetPathArray.push(item.title.logo_image_url);
				}
			});
		});

		if (this.inputTarget.concert.length === 0) {
			jQuery('.current-month-list').css('display', 'none');
			jQuery('.future-list').css('display', 'none');
			jQuery('.past-concert-list').css('display', 'none');
			jQuery('.err-message').css('display', 'block');
			this.model.errorMsg = 'Define one target at least !';
		} else {
			jQuery('.current-month-list').css('display', 'block');
			jQuery('.future-list').css('display', 'block');
			jQuery('.past-concert-list').css('display', 'block');
			jQuery('.err-message').css('display', 'none');
			this.model.errorMsg = '';
			this.getTarget();
		}
	};

	getPastTarget = (target) => {
		this.submitted = false;
		jQuery('.pastonly-concert-list').css('display', 'block');
		jQuery('.paging_block').css('display', 'block');
		jQuery('.current-month-list').css('display', 'none');
		jQuery('.past-concert-list').css('display', 'none');
		jQuery('.future-list').css('display', 'none');
		this.getOnlyPastConcerts = [];
		this.getCurrentConcerts = [];
		this.getPastConcerts = [];
		this.getNextConcerts = [];
		this.concertTitleArray = [];
		this.cityArray = [];
		this.model.id = [];
		this.concertIdArray = [];
		this.concertArray.forEach((item) => {
			this.cityArray.push(<Concert>item.concert_places);
			this.model.id = item.id;
			this.concertIdArray.push([{
				id: this.model.id.toString(),
				name: item.concert_name
			}]);
			let tempDate =
				item.concert_places.event_date.split('-')[0] +
				'/' +
				item.concert_places.event_date.split('-')[1] +
				'/' +
				item.concert_places.event_date.split('-')[2];
			let elm = [{
				date: tempDate,
				place: item.concert_places.concert_place,
				title: item.concert_name,
				path: item.title.logo_image_url
			}];

			let oneDigit = Number(item.concert_places.event_date.split('-')[1][1]);
			let doubleDigit = Number(item.concert_places.event_date.split('-')[1][0]);
			let numThisYear = Number(this.yearMonthArray[0].thisYear);
			let numThisMonth = Number(this.yearMonthArray[0].thisMonth);
			let numDBYear = Number(item.concert_places.event_date.split('-')[0]);
			let numDBMonth = Number(item.concert_places.event_date.split('-')[1]);
			if (numThisYear === numDBYear) {
				if (doubleDigit === 0 && numThisMonth > oneDigit) {
					this.getOnlyPastConcerts.push(elm);
				} else if (doubleDigit === 1 && numThisMonth > numDBMonth) {
					this.getOnlyPastConcerts.push(elm);
				}
			} else if (numThisYear > numDBYear) {
				this.getOnlyPastConcerts.push(elm);
			}
		});
	};

	getTarget = () => {

		this.cityArray.forEach((item, index) => {
			let getConcertUTCTime = new Date(item.event_date);
			this.dateService.getUTCTime(getConcertUTCTime);
			let concertYear = getConcertUTCTime.getFullYear();
			let concertMonth = getConcertUTCTime.getMonth() + 1;
			let concertDay = getConcertUTCTime.getDate();

			let tempDate = concertYear + '/' + concertMonth + '/' + concertDay;
			let elm = [{
				date: tempDate,
				place: item.concert_place,
				title: this.concertTitleArray[index],
				path: this.imgGetPathArray[index]
			}];

			let numThisYear = Number(this.yearMonthArray[0].thisYear);
			let numThisMonth = Number(this.yearMonthArray[0].thisMonth);
			if (numThisYear < concertYear) {
			} else if (numThisYear === concertYear) {
				if (numThisMonth > concertMonth) {
				this.getPastConcerts.push(elm);
			} else if (numThisMonth === concertMonth) {
				this.getCurrentConcerts.push(elm);
				this.model.showCurrentYearMonth = numThisYear + '/' + numThisMonth;
			} else if (numThisMonth < concertMonth) {
				this.getNextConcerts.push(elm);
			}
			} else if (numThisYear > concertYear) {
				this.getPastConcerts.push(elm);
			}
		});

		if (this.getCurrentConcerts.length > 0) {
			jQuery('.current-month-list').css('display', 'block');
		} else {
			jQuery('.current-month-list').css('display', 'none');
		}

		if (this.getPastConcerts.length > 0) {
			jQuery('.past-concert-list').css('display', 'block');
		} else {
			jQuery('.past-concert-list').css('display', 'none');
		}

		if (this.getNextConcerts.length > 0) {
			jQuery('.future-list').css('display', 'block');
		} else {
			jQuery('.future-list').css('display', 'none');
		}
	};

	gotoDetail = (concertTitle) => {
		let concertId: number;
		this.concertIdArray.forEach((item, index) => {
			for (let i of this.concertIdArray[index]) {
				if (i.name === concertTitle) {
					concertId = +i.id;
				}
			}
		});
		this.router.navigate(['/concert', concertId]);
	};
}
