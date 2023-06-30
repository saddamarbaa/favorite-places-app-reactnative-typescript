export interface Review {
	text: string
	rating: number
	author: string
}

export interface PlaceT {
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
}

export interface LocationT {
	latitude: number
	longitude: number
}
