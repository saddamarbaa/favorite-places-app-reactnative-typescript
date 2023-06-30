import React, { useEffect, useState } from 'react'
import {
	Alert,
	Linking,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import * as Location from 'expo-location'

import { FormButton, Map } from '../ui'
import { GlobalStyles } from '../../constants'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { LocationT, RootStackParamList } from '../../types'
import { MapPressEvent, Region } from 'react-native-maps'

interface LocationPickerProps {
	selectedLocation: LocationT | null
	setSelectedLocation: (location: LocationT | null) => void
	locationError: boolean
	setLocationError: (error: boolean) => void
	mapRegion: Region
	setMapRegion: (location: Region | null) => void
}

export function LocationPicker({
	selectedLocation,
	setSelectedLocation,
	locationError,
	setLocationError,
	mapRegion,
	setMapRegion,
}: LocationPickerProps) {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	const [locationPermission, setLocationPermission] =
		useState<Location.PermissionStatus | null>(null)

	useEffect(() => {
		checkLocationPermission()
	}, [])

	async function checkLocationPermission() {
		const { status } = await Location.requestForegroundPermissionsAsync()
		setLocationPermission(status)
	}

	function handleOpenSettings() {
		if (Platform.OS === 'ios') {
			Linking.openURL('app-settings:')
		} else {
			Linking.openSettings()
		}
	}

	async function getCurrentLocation() {
		if (locationPermission === Location.PermissionStatus.DENIED) {
			Alert.alert(
				'Location Permission Denied',
				'Please grant location permission to access your current location. You can enable location permission in the device settings.',
				[
					{ text: 'Cancel', style: 'cancel' },
					{ text: 'Open Settings', onPress: handleOpenSettings },
				],
			)
			return
		}

		try {
			const { coords } = await Location.getCurrentPositionAsync()
			const { latitude, longitude } = coords

			setMapRegion({
				latitude,
				longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			})
			setSelectedLocation({ latitude, longitude })
			setLocationError(false)
		} catch (error) {
			console.log('Error occurred while fetching location:', error)
		}
	}

	const handleLocationRemove = () => {
		setSelectedLocation(null)
		setLocationError(false)
	}

	function handleMapRegionChange(region: Region) {
		setMapRegion(region)
		setSelectedLocation({
			latitude: region.latitude,
			longitude: region.longitude,
		})
	}

	function handlerPickLocationOnMap() {
		navigation.navigate('Map')
	}

	function handleMapPress(event: MapPressEvent) {
		const { coordinate } = event.nativeEvent
		setSelectedLocation({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		})
	}
	return (
		<>
			<View style={styles.buttonsWrapper}>
				<FormButton
					buttonTitle="Locate User"
					btnType="map-pin"
					buttonContainerStyle={styles.buttonContainer}
					iconSize={18}
					iconColor={GlobalStyles.colors.secondary500}
					buttonTextStyle={{
						color: GlobalStyles.colors.secondary500,
					}}
					buttonPressedStyle={{
						opacity: 0.3,
					}}
					onPress={getCurrentLocation}
				/>
				<FormButton
					buttonTitle="Pick on Map"
					btnType="map"
					buttonContainerStyle={styles.buttonContainer}
					iconSize={18}
					iconColor={GlobalStyles.colors.secondary500}
					buttonTextStyle={{
						color: GlobalStyles.colors.secondary500,
					}}
					buttonPressedStyle={{
						opacity: 0.3,
					}}
					onPress={handlerPickLocationOnMap}
				/>
			</View>
			{selectedLocation && !locationError ? (
				<>
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
					<Map
						mapRegion={mapRegion}
						handleMapRegionChange={handleMapRegionChange}
						selectedLocation={selectedLocation}
						onPress={handleMapPress}
					/>
				</>
			) : (
				<View style={styles.locationPlaceholderContainer}>
					<Text style={styles.locationPlaceholderText}>
						{locationError
							? 'Failed to fetch location'
							: 'No Location Selected'}
					</Text>
				</View>
			)}
		</>
	)
}

export default LocationPicker

const styles = StyleSheet.create({
	buttonsWrapper: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
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
		color: 'black',
		marginBottom: 10,
	},
	locationPlaceholderContainer: {
		width: '100%',
		height: 200,
		backgroundColor: '#EFEFEF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		marginBottom: 10,
	},
	locationPlaceholderText: {
		fontSize: 16,
		color: '#777',
	},
	buttonContainer: {
		flex: 1,
		marginVertical: 10,
		alignSelf: 'center',
		borderWidth: 1,
		borderColor: GlobalStyles.colors.secondary500,
		borderRadius: 10,
		backgroundColor: 'white',
	},
	removeButton: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 1,
	},
})
