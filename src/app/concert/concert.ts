export class Concert {
	id: number;
	concert_name: string;
	concert_image_url: string;
	title: {
		title: string,
		logo_image_url: string,
		logo_alt: string,
	};
	concert_places: {
		concert_id: number,
		event_date: string,
		concert_place: string,
		event_end_time: string
	};
}
