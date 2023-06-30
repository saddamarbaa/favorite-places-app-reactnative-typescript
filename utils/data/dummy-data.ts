import { Place } from '../../models'
import { PlaceT, Review } from '../../types'

// Function to generate a random unique identifier
export function generateUniqueId(): string {
	const uniqueId = Math.random().toString(36).substring(2, 10)
	return uniqueId
}

// Function to generate dummy data for a place
export function generateDummyPlace(): PlaceT {
	const place: PlaceT = {
		title: 'Dummy Place',
		imageUrl: 'https://dummyimage.com/400x300',
		id: generateUniqueId(),
		address: '123 Dummy Street, City',
		description: 'This is a dummy place for testing purposes.',
		location: {
			latitude: 123.456,
			longitude: -12.345,
		},
		reviews: generateDummyReviews(), // Generate dummy reviews
		averageRating: generateAverageRating(), // Generate average rating
		reviewCount: generateReviewCount(), // Generate review count
	}

	return place
}

// Function to generate dummy reviews
export function generateDummyReviews(): Review[] {
	const reviews: Review[] = []

	// Generate a random number of reviews (between 0 and 10)
	const numReviews = Math.floor(Math.random() * 11)

	for (let i = 0; i < numReviews; i++) {
		const review: Review = {
			text: `Review ${i + 1}`,
			rating: Math.floor(Math.random() * 5) + 1, // Generate a random rating (between 1 and 5)
			author: `User ${i + 1}`,
		}

		reviews.push(review)
	}

	return reviews
}

// Function to generate average rating
export function generateAverageRating(): number {
	const randomRating = Math.random() * 4 + 1 // Generate a random rating between 1 and 5
	const truncatedRating = Math.floor(randomRating * 10) / 10 // Keep only 1 decimal place
	return truncatedRating > 3 ? truncatedRating : 4.5 // Ensure the rating is greater than 3
}

// Function to generate review count
export function generateReviewCount(): number {
	// Generate a random review count (between 0 and 10)
	return Math.floor(Math.random() * 11)
}

// Generate dummy places
const dummyPlaces: PlaceT[] = Array.from({ length: 20 }, () =>
	generateDummyPlace(),
)

// Create instances of Place class
const places: Place[] = dummyPlaces.map((placeData) => new Place(placeData))

export const PLACES: Place[] = places

// Output the generated dummy places
console.log(dummyPlaces)


