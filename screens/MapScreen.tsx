import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { FormButton, Map } from '../components'
import { MapPressEvent, Region } from 'react-native-maps'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../types'

export function MapScreen() {
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

	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	useFocusEffect(
		useCallback(() => {
			setSelectedLocation(null)
		}, []),
	)

	const savePickedLocationHandler = useCallback(() => {
		if (!selectedLocation) {
			Alert.alert(
				'No location picked',
				'You have to pick a location by tapping on the map first.',
			)
			return
		}

		redirectHandler()
	}, [navigation, selectedLocation])

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: ({ tintColor }) => (
				<FormButton
					isIconButton
					iconName="add"
					iconSize={29}
					iconColor={tintColor}
					iconPressedStyle={{ backgroundColor: 'white' }}
					onPress={savePickedLocationHandler}
				/>
			),
		})
	}, [navigation, savePickedLocationHandler])

	function handleMapRegionChange(region: Region) {
		setMapRegion(region)
		setSelectedLocation({
			latitude: region.latitude,
			longitude: region.longitude,
		})
	}

	function redirectHandler() {
		if (selectedLocation) {
			navigation.navigate('AddPlace', {
				latitude: selectedLocation.latitude,
				longitude: selectedLocation.longitude,
			})
		} else {
			navigation.navigate('AddPlace')
		}
	}

	function handleMapPress(event: MapPressEvent) {
		const { coordinate } = event.nativeEvent
		setSelectedLocation({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		})
	}

	function handleLocationRemove() {
		setSelectedLocation(null)
		redirectHandler()
	}

	return (
		<View style={styles.container}>
			{selectedLocation && (
				<View style={styles.locationContainer}>
					<View>
						<Text style={styles.locationText}>
							Latitude: {selectedLocation.latitude.toFixed(4)}
						</Text>
						<Text style={styles.locationText}>
							Longitude: {selectedLocation.longitude.toFixed(4)}
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

export default MapScreen