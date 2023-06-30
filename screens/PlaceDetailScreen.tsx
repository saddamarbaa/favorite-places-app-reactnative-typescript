import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, {
	useCallback,
	useContext,
	useLayoutEffect,
	useState,
} from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { FormButton, Map } from '../components'
import { useFocusEffect } from '@react-navigation/native'
import { DetailsScreenProps, PlaceT } from '../types'
import { FavoritePlacesContext } from '../globalStates'
import { MapPressEvent, Region } from 'react-native-maps'

export function PlaceDetailScreen({ navigation, route }: DetailsScreenProps) {
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

	const [place, setPlace] = useState<PlaceT | null>(null)
	const { favoritePlaces, removeFavoritePlace } = useContext(
		FavoritePlacesContext,
	)

	useLayoutEffect(() => {
		const { id } = route.params
		const selectedPlace = favoritePlaces.find((place) => place.id === id)
		setPlace(selectedPlace || null)
		setSelectedLocation(selectedPlace?.location || null)
		setMapRegion((prevRegion) => ({
			...prevRegion,
			latitude: selectedPlace?.location?.latitude || prevRegion.latitude,
			longitude: selectedPlace?.location?.longitude || prevRegion.longitude,
		}))
	}, [route.params, favoritePlaces, navigation, place])

	const removePlaceHandler = useCallback(() => {
		if (place) {
			removeFavoritePlace(place.id)
			navigation.goBack()
		}
	}, [navigation, place, removeFavoritePlace])

	useLayoutEffect(() => {
		navigation.setOptions({
			title: place?.title || '',
			headerRight: ({ tintColor }) => (
				<FormButton
					isIconButton
					iconName="trash"
					iconSize={25}
					iconColor={'red'}
					iconPressedStyle={{ backgroundColor: 'white' }}
					onPress={removePlaceHandler}
				/>
			),
		})
	}, [navigation, removePlaceHandler, place])

	function handleLocationRemove() {
		if (place) {
			removeFavoritePlace(place.id)
			navigation.goBack()
		}
	}

	function handleMapPress(event: MapPressEvent) {
		const { coordinate } = event.nativeEvent
		setSelectedLocation({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		})
	}

	function handleMapRegionChange(region: Region) {
		setMapRegion(region)
		setSelectedLocation({
			latitude: region.latitude,
			longitude: region.longitude,
		})
	}

	return (
		<View style={styles.container}>
			{place && (
				<View style={styles.locationContainer}>
					<View>
						<Text style={styles.locationText}>
							Latitude: {place.location?.latitude.toFixed(4)}
						</Text>
						<Text style={styles.locationText}>
							Longitude: {place.location?.longitude.toFixed(4)}
						</Text>
					</View>
					<TouchableOpacity
						style={styles.removeButton}
						onPress={handleLocationRemove}>
						<FontAwesome name="times-circle" size={24} color="red" />
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.mapContainer}>
				<Map
					mapRegion={mapRegion}
					handleMapRegionChange={handleMapRegionChange}
					selectedLocation={selectedLocation}
					onPress={handleMapPress}
					mapContainerStyle={styles.container}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mapContainer: {
		flex: 1,
		width: '100%',
	},
	locationContainer: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 8,
		backgroundColor: '#f0f0f0',
		borderRadius: 8,
		margin: 8,
	},
	locationText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	removeButton: {
		marginLeft: 8,
	},
})

export default PlaceDetailScreen
