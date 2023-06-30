import React, { useCallback, useEffect, useState } from 'react'
import { Region } from 'react-native-maps'
import { useIsFocused } from '@react-navigation/native'


import { PlacesForm } from '../components'
import { AddPlaceScreenProps } from '../types'

export function AddPlaceScreen({ route, navigation }: AddPlaceScreenProps) {
	const [mapRegion, setMapRegion] = useState<Region>({
		latitude: 37.7749, // San Francisco latitude
		longitude: -122.4194, // San Francisco longitude
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	})

	const [selectedLocation, setSelectedLocation] = useState<{
		latitude: number
		longitude: number
	} | null>(null)

	const isFocused = useIsFocused()

	useEffect(() => {
		const latitude = route?.params?.latitude
		const longitude = route?.params?.longitude

		if (latitude && longitude && isFocused) {
			setSelectedLocation({
				latitude: latitude,
				longitude: longitude,
			})
		}
	}, [route?.params?.latitude, route?.params?.longitude, isFocused])

	return (
		<PlacesForm
			selectedLocation={selectedLocation}
			setSelectedLocation={setSelectedLocation}
			mapRegion={mapRegion}
			setMapRegion={setMapRegion}
		/>
	)
}

export default AddPlaceScreen
