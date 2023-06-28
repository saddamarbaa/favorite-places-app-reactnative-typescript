import { Keyboard, StyleSheet, View, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import Toast from 'react-native-toast-message'
import {
	NavigationProp,
	useFocusEffect,
	useNavigation,
} from '@react-navigation/native'

import { FormButton, FormInput } from '../ui'
import { GlobalStyles } from '../../constants'
import { RootStackParamList } from '../../types'
import ImagePicker from './ImagePicker'

const initialFormState = {
	description: {
		value: '',
		isValid: true,
	},
	title: {
		value: '',
		isValid: true,
	},
	address: {
		value: '',
		isValid: true,
	},
	location: {
		latitude: 0,
		longitude: 0,
	},
}

export function PlacesForm() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	const [formState, setFormState] = useState(initialFormState)
	const { description, title, address, location } = formState
	 const [selectedImage, setSelectedImage] = useState<string | null>(null)
		const [imageError, setImageError] = useState(false)

	const isFormInvalid =
		!description.isValid ||
		!title.isValid ||
		!address.isValid ||
		description.value === '' ||
		title.value === '' ||
		address.value === ''

	useFocusEffect(
		useCallback(() => {
			setFormState(initialFormState)
		}, []),
	)

function redirectHandler() {
	// Clear the form state and error fields when navigating back to the form
	setFormState(initialFormState)
	setSelectedImage(null) // Clear the selected image state
	setImageError(false) // Reset the image error state
	navigation.goBack()
}
	const dismissKeyboard = () => {
		Keyboard.dismiss()
	}

	function handleConfirm() {
		dismissKeyboard()

		// Reset the validation status
		setFormState((prevState) => ({
			...prevState,
			description: {
				...prevState.description,
				isValid: true,
			},
			title: {
				...prevState.title,
				isValid: true,
			},
			address: {
				...prevState.address,
				isValid: true,
			},
		}))

		Toast.show({
			type: 'success',
			text1: 'Form Submitted',
			text2: 'Your form has been submitted successfully.',
			position: 'top',
			// topOffset: 20,
			// bottomOffset: 0,
			visibilityTime: 4000,
			autoHide: true,
			onShow: () => console.log('Toast shown'),
			onHide: () => console.log('Toast hidden'),
		})

		redirectHandler()
	}

	function handleCancel() {
		Toast.show({
			type: 'error',
			text1: 'Form Cancelled',
			text2: 'You have cancelled the form submission.',
			// position: 'bottom',
			// topOffset: 20,
			// bottomOffset: 0,
			visibilityTime: 4000,
			autoHide: true,
			onShow: () => console.log('Toast shown'),
			onHide: () => console.log('Toast hidden'),
			onPress: () => console.log('Toast pressed'),
		})
		redirectHandler()
	}

	const validateInput = (inputIdentifier, enteredValue) => {
		// Reset the validation status
		setFormState((prevState) => ({
			...prevState,
			[inputIdentifier]: {
				...prevState[inputIdentifier],
				isValid: true,
			},
		}))

		if (inputIdentifier === 'description') {
			if (enteredValue.trim() === '') {
				setFormState((prevState) => ({
					...prevState,
					description: {
						...prevState.description,
						isValid: false,
					},
				}))
			}
		} else if (inputIdentifier === 'title') {
			if (enteredValue.trim() === '') {
				setFormState((prevState) => ({
					...prevState,
					title: {
						...prevState.title,
						isValid: false,
					},
				}))
			}
		} else if (inputIdentifier === 'address') {
			if (enteredValue.trim() === '') {
				setFormState((prevState) => ({
					...prevState,
					address: {
						...prevState.address,
						isValid: false,
					},
				}))
			}
		}
	}

	const handleInputChange = (
		inputIdentifier: 'title' | 'description' | 'imageUrl' | 'address',
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
					value={title.value}
					errorMessage={!title.isValid ? 'Please enter a title' : ''}
					error={!title.isValid}
					onChangeText={handleInputChange.bind(null, 'title')}
					inputStyle={{
						...styles.input,
					}}
					textAlignVertical="top"
					placeholder=""
					label="Title"
					multiline={false}
					autoCorrect={false}
					autoCapitalize="sentences"
					inputContainerStyle={title.isValid ? styles.inputContainer : null}
				/>

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

				<FormInput
					value={address.value}
					errorMessage={!address.isValid ? 'Please enter an address' : ''}
					error={!address.isValid}
					onChangeText={handleInputChange.bind(null, 'address')}
					inputContainerStyle={address.isValid ? styles.inputContainer : null}
					inputStyle={{
						...styles.input,
					}}
					textAlignVertical="top"
					placeholder=""
					label="Address"
					multiline={false}
					autoCorrect={false}
					autoCapitalize="sentences"
				/>

				<View style={styles.buttonsWrapper}>
					<FormButton
						disabled={isFormInvalid}
						buttonTitle={'Add'}
						onPress={handleConfirm}
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
