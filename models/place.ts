import { PlaceT, Review } from '../types'

export class Place {
	id: string
	title: string
	imageUrl: string
	address: string
	description: string
	location: {
		latitude: number
		longitude: number
	}
	reviews?: Review[]
	averageRating?: number
	reviewCount?: number

	constructor({
		id,
		title,
		imageUrl,
		address,
		description,
		location,
		reviews,
		averageRating,
		reviewCount,
	}: PlaceT) {
		this.id = id
		this.title = title
		this.imageUrl = imageUrl
		this.address = address
		this.description = description
		this.location = location
		this.reviews = reviews
		this.averageRating = averageRating
		this.reviewCount = reviewCount
	}
}

export default Place
