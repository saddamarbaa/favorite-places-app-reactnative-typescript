import React, { useContext, useEffect, useState } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { GlobalStyles } from '../constants'
import { FavoritePlacesContext, useAuthContext } from '../globalStates'
import { AuthStack } from './AuthStack'
import { MainAppStack } from './MainAppStack'
import { LoadingOverlay } from '../components'

export function AppNavigator() {
	const {
		state: { isAuthenticated, user },
		login,
		logout,
	} = useAuthContext()
	const [isLoading, setIsLoading] = useState(true)
	const {
		favoritePlaces,
		addFavoritePlace,
		removeFavoritePlace,
		updateFavoritePlace,
	} = useContext(FavoritePlacesContext)

	useEffect(() => {
		const checkAuthenticationStatus = async () => {
			setIsLoading(true)
			try {
				// Perform async task here (e.g., check authentication status)
				// For example, retrieve the user from AsyncStorage
				const storedUser = await AsyncStorage.getItem('user')
				// If user exists, set isAuthenticated to true and update the user in context
				if (storedUser) {
					try {
						const parsedUser = JSON.parse(storedUser)
						login(parsedUser)
					} catch (error) {
						console.error('Error parsing user data:', error)
						// Handle the parsing error by treating it as if no user is found
						login(null)
					}
				}
			} catch (error) {
				console.error('Error checking authentication status:', error)
			}
		}

		checkAuthenticationStatus()
	}, [])

	useEffect(() => {
		const retrieveStoredFavoritePlaces = async () => {
			try {
				// Retrieve favorite places from storage
				const storedFavoritePlaces = await AsyncStorage.getItem(
					'favoritePlaces',
				)
				if (storedFavoritePlaces) {
					await AsyncStorage.removeItem('favoritePlaces')
					const parsedFavoritePlaces = JSON.parse(storedFavoritePlaces)
					// Update the context with the retrieved favorite places
					parsedFavoritePlaces.forEach((place) => addFavoritePlace(place))
				}
			} catch (error) {
				console.log('Error retrieving stored favorite places:', error)
			} finally {
				setIsLoading(false)
			}
		}

		retrieveStoredFavoritePlaces()
	}, [])

	if (isLoading) {
		return <LoadingOverlay />
	}

	const theme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: GlobalStyles.colors.secondary500,
			background: GlobalStyles.colors.mainBackground,
		},
	}

	return (
		<NavigationContainer theme={theme}>
			{!user ? <MainAppStack /> : <AuthStack />}
		</NavigationContainer>
	)
}

export default AppNavigator
