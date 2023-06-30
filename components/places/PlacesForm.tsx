import { Keyboard, StyleSheet, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import * as Location from 'expo-location'

import { FormButton, FormInput } from '../ui'
import { GlobalStyles } from '../../constants'
import { LocationT, RootStackParamList } from '../../types'
import ImagePicker from './ImagePicker'
import LocationPicker from './LocationPicker'
import { Region } from 'react-native-maps'
import { FavoritePlacesContext } from '../../globalStates'
import {
	generateAverageRating,
	generateDummyReviews,
	generateReviewCount,
	generateUniqueId,
} from '../../utils'
import { Place } from '../../models'

interface Props {
	selectedLocation: LocationT | null
	setSelectedLocation: (location: LocationT | null) => void
	mapRegion: Region
	setMapRegion: (location: Region | null) => void
}

const initialFormState = {
	description: {
		value: '',
		isValid: true,
	},
}

export function PlacesForm({
	selectedLocation,
	setSelectedLocation,
	mapRegion,
	setMapRegion,
}: Props) {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	const [formState, setFormState] = useState(initialFormState)
	const { description } = formState
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [imageError, setImageError] = useState(false)
	const [locationError, setLocationError] = useState(false)
	const {
		favoritePlaces,
		addFavoritePlace,
		removeFavoritePlace,
		updateFavoritePlace,
	} = useContext(FavoritePlacesContext)

	const isFormInvalid = !selectedLocation || !selectedImage

	const clearFormAndLocation = () => {
		setFormState(initialFormState)
		setSelectedLocation(null)
	}

	useEffect(() => {
		clearFormAndLocation()
	}, [])

	function redirectHandler() {
		clearFormAndLocation()
		setSelectedImage(null)
		setImageError(false)
		navigation.goBack()
	}

	const dismissKeyboard = () => {
		Keyboard.dismiss()
	}

	// Convert coordinates to address
	const reverseGeocode = async (latitude, longitude) => {
		try {
			const location = await Location.reverseGeocodeAsync({
				latitude,
				longitude,
			})
			if (location && location.length > 0) {
				const address = location[0]
				console.log('Address:', address)
				return address
			}
		} catch (error) {
			console.error('Error occurred during reverse geocoding:', error)
		}
	}

	async function handleConfirm() {
		dismissKeyboard()

		setFormState((prevState) => ({
			...prevState,
			description: {
				...prevState.description,
				isValid: true,
			},
		}))

		const place = {
			title: '',
			imageUrl: selectedImage || 'https://dummyimage.com/400x300',
			id: generateUniqueId(),
			address: '',
			description: description.value,
			location: selectedLocation
				? selectedLocation
				: { latitude: 0, longitude: 0 },
			reviews: generateDummyReviews(),
			averageRating: generateAverageRating(),
			reviewCount: generateReviewCount(),
		}

		if (selectedLocation) {
			const { latitude, longitude } = selectedLocation
			const addressData = await reverseGeocode(latitude, longitude)
			if (addressData) {
				const address = [
					addressData.street,
					// addressData.city,
					addressData.region,
					addressData.postalCode,
					addressData.country,
				]
					.filter((value) => value) // Filter out undefined or empty values
					.join(', ')
				place.address = address
				place.title = addressData.street
			}
		}

		const newPlace: Place = new Place(place)

		addFavoritePlace(newPlace)

		// Show success toast
		Toast.show({
			type: 'success',
			text1: 'Form Submitted',
			text2: 'Your form has been submitted successfully.',
			position: 'top',
			visibilityTime: 4000,
			autoHide: true,
		})

		redirectHandler()
	}

	function handleCancel() {
		Toast.show({
			type: 'error',
			text1: 'Form Cancelled',
			text2: 'You have cancelled the form submission.',
			visibilityTime: 4000,
			autoHide: true,
		})
		redirectHandler()
	}

	const validateInput = (inputIdentifier, enteredValue) => {
		const isValid = enteredValue.trim() !== ''
		setFormState((prevState) => ({
			...prevState,
			[inputIdentifier]: {
				...prevState[inputIdentifier],
				isValid: isValid,
			},
		}))
	}

	const handleInputChange = (
		inputIdentifier: 'title' | 'description',
		enteredValue: string,
	) => {
		validateInput(inputIdentifier, enteredValue)
		setFormState((prevState) => ({
			...prevState,
			[inputIdentifier]: {
				...prevState[inputIdentifier],
				value: enteredValue,
			},
		}))
	}
	return (
		<ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
			<View style={styles.form}>
				<FormInput
					value={description.value}
					errorMessage={
						!description.isValid ? 'Please enter a description' : ''
					}
					error={!description.isValid}
					onChangeText={handleInputChange.bind(null, 'description')}
					inputContainerStyle={
						description.isValid
							? {
									...styles.inputContainer,
									...styles.descriptionInput,
							  }
							: {
									...styles.descriptionInput,
							  }
					}
					inputStyle={{
						...styles.input,
					}}
					textAlignVertical="top"
					placeholder=""
					label="Description"
					multiline={true}
					autoCorrect={false}
					autoCapitalize="sentences"
				/>

				<ImagePicker
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					imageError={imageError}
					setImageError={setImageError}
				/>

				<LocationPicker
					selectedLocation={selectedLocation}
					setSelectedLocation={setSelectedLocation}
					locationError={locationError}
					setLocationError={setLocationError}
					mapRegion={mapRegion}
					setMapRegion={setMapRegion}
				/>

				<View style={styles.buttonsWrapper}>
					<FormButton
						disabled={isFormInvalid}
						buttonTitle={'Add'}
						onPress={handleConfirm}
						buttonPressedStyle={styles.buttonContainer}
						buttonContainerStyle={[
							styles.buttonContainer,
							{
								backgroundColor: isFormInvalid
									? GlobalStyles.colors.primary300 // Disabled background color
									: GlobalStyles.colors.secondary500, // Enabled background color
								opacity: isFormInvalid ? 0.5 : 1,
							},
						]}
					/>
					<FormButton
						buttonTitle="Cancel"
						mode="flat"
						onPress={handleCancel}
						buttonContainerStyle={{ flex: 1 }}
						buttonTextStyle={{ color: GlobalStyles.colors.secondary500 }}
					/>
				</View>
			</View>
		</ScrollView>
	)
}

export default PlacesForm

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	wrapper: {
		flex: 1,
		padding: 24,
		paddingBottom: 50,
	},
	deleteIconContainer: {
		marginBottom: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: 'center',
	},
	buttonsWrapper: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 50,
	},
	buttonContainer: {
		flex: 1,
	},
	inputContainer: {
		width: '100%',
		maxHeight: 50,
		// backgroundColor: GlobalStyles.colors.primary100,
	},
	inputField: {
		backgroundColor: '#ffc2c2',
	},
	input: {
		width: '100%',
		color: GlobalStyles.colors.secondary500,
	},
	form: {
		marginTop: 30,
	},
	descriptionInput: {
		maxHeight: 100,
		height: 80,
	},
})
