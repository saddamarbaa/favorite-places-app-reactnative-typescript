import React, { createContext, useReducer, useContext, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	ADD_FAVORITE_PLACE,
	REMOVE_FAVORITE_PLACE,
	UPDATE_FAVORITE_PLACE,
} from '../../constants'
import { PlaceT } from '../../types'
import { PLACES } from '../../utils'

type FavoritePlaceAction =
	| { type: typeof ADD_FAVORITE_PLACE; payload: { place: PlaceT } }
	| { type: typeof REMOVE_FAVORITE_PLACE; payload: { placeId: string } }
	| {
			type: typeof UPDATE_FAVORITE_PLACE
			payload: { place: Partial<PlaceT>; placeId: string }
	  }

type FavoritePlaceState = {
	favoritePlaces: PlaceT[]
}

const favoritePlaceReducer = (
	state: FavoritePlaceState,
	action: FavoritePlaceAction,
) => {
	switch (action.type) {
		case ADD_FAVORITE_PLACE:
			return {
				...state,
				favoritePlaces: [action.payload.place, ...state.favoritePlaces],
			}
		case REMOVE_FAVORITE_PLACE:
			return {
				...state,
				favoritePlaces: state.favoritePlaces.filter(
					(place) => place.id !== action.payload.placeId,
				),
			}
		case UPDATE_FAVORITE_PLACE:
			return {
				...state,
				favoritePlaces: state.favoritePlaces.map((place) =>
					place.id === action.payload.placeId
						? { ...place, ...action.payload.place }
						: place,
				),
			}
		default:
			return state
	}
}

type FavoritePlacesContextProps = {
	favoritePlaces: PlaceT[]
	addFavoritePlace: (place: PlaceT) => void
	removeFavoritePlace: (placeId: string) => void
	updateFavoritePlace: (place: Partial<PlaceT>, placeId: string) => void
}

export const FavoritePlacesContext = createContext<FavoritePlacesContextProps>({
	favoritePlaces: [],
	addFavoritePlace: () => {},
	removeFavoritePlace: () => {},
	updateFavoritePlace: () => {},
})

export const FavoritePlacesProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(favoritePlaceReducer, {
		favoritePlaces: [] || PLACES, // Use dummyPlaces as the initial state
	})

	const addFavoritePlace = async (place: PlaceT) => {
		try {
			// Store the new favorite place in local storage
			await AsyncStorage.setItem(
				'favoritePlaces',
				JSON.stringify([place, ...state.favoritePlaces]),
			)

			// Update the state with the new favorite place
			dispatch({ type: ADD_FAVORITE_PLACE, payload: { place } })
		} catch (error) {
			console.log('Error adding favorite place:', error)
		}
	}

	const removeFavoritePlace = async (placeId: string) => {
		try {
			// Remove the favorite place from local storage
			const updatedFavoritePlaces = state.favoritePlaces.filter(
				(place) => place.id !== placeId,
			)
			await AsyncStorage.setItem(
				'favoritePlaces',
				JSON.stringify(updatedFavoritePlaces),
			)

			// Update the state with the removed favorite place
			dispatch({ type: REMOVE_FAVORITE_PLACE, payload: { placeId } })
		} catch (error) {
			console.log('Error removing favorite place:', error)
		}
	}

	const updateFavoritePlace = async (
		place: Partial<PlaceT>,
		placeId: string
	) => {
		try {
			// Update the favorite place in local storage
			const updatedFavoritePlaces = state.favoritePlaces.map((place) =>
				place.id === placeId ? { ...place, ...place } : place
			);
			await AsyncStorage.setItem(
				'favoritePlaces',
				JSON.stringify(updatedFavoritePlaces)
			);

			// Update the state with the updated favorite place
			dispatch({
				type: UPDATE_FAVORITE_PLACE,
				payload: { place, placeId },
			});
		} catch (error) {
			console.log('Error updating favorite place:', error);
		}
	};

	const contextValue: FavoritePlacesContextProps = {
		favoritePlaces: state.favoritePlaces,
		addFavoritePlace,
		removeFavoritePlace,
		updateFavoritePlace,
	};

	return (
		<FavoritePlacesContext.Provider value={contextValue}>
			{children}
		</FavoritePlacesContext.Provider>
	);

}

export const useFavoritePlacesContext = () => useContext(FavoritePlacesContext)
