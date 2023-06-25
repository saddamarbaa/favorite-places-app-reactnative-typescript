import {
	Keyboard,
	StyleSheet,
	Text,
	View,
	ScrollView,
	Image,
	TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

import { FormButton, FormInput } from '../ui'
import { GlobalStyles } from '../../constants'

export function PlacesForm() {
	const [formState, setFormState] = useState({
		description: {
			value: '',
			isValid: true,
		},
		title: {
			value: '',
			isValid: true,
		},
		imageUrl: {
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
	})

	const { description, title, imageUrl, address, location } = formState
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [imageError, setImageError] = useState(false)

	const isFormInvalid =
		!description.isValid ||
		!title.isValid ||
		!imageUrl.isValid ||
		!address.isValid ||
		description.value === '' ||
		title.value === '' ||
		imageUrl.value === '' ||
		address.value === ''

	function redirectHandler() {
		// navigation.goBack()
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
			imageUrl: {
				...prevState.imageUrl,
				isValid: true,
			},
			address: {
				...prevState.address,
				isValid: true,
			},
		}))

		redirectHandler()
	}

	function handleCancel() {
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
		} else if (inputIdentifier === 'imageUrl') {
			if (enteredValue.trim() === '') {
				setFormState((prevState) => ({
					...prevState,
					imageUrl: {
						...prevState.imageUrl,
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

		if (inputIdentifier === 'imageUrl') {
			setImagePreview(enteredValue)
		}
	}

	const handleImageRemove = () => {
		setImagePreview('')
		setFormState((prevState) => ({
			...prevState,
			imageUrl: {
				...prevState.imageUrl,
				value: '',
				isValid: true,
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

				<FormInput
					value={imageUrl.value}
					errorMessage={!imageUrl.isValid ? 'Please enter an image URL' : ''}
					error={!imageUrl.isValid}
					onChangeText={handleInputChange.bind(null, 'imageUrl')}
					inputContainerStyle={imageUrl.isValid ? styles.inputContainer : null}
					inputStyle={{
						...styles.input,
					}}
					textAlignVertical="top"
					placeholder=""
					label="Image URL"
					multiline={false}
					autoCorrect={false}
					autoCapitalize="none"
				/>

				{imagePreview && !imageError ? (
					<View style={styles.imagePreviewContainer}>
						<Image
							source={{ uri: imagePreview }}
							style={styles.imagePreview}
							onError={() => setImageError(true)}
						/>
						<TouchableOpacity
							style={styles.removeButton}
							onPress={handleImageRemove}>
							<FontAwesome name="times-circle" size={24} color="red" />
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.imagePlaceholderContainer}>
						<Text style={styles.imagePlaceholderText}>
							{imageError ? 'Failed to load image' : 'No Image Selected'}
						</Text>
					</View>
				)}
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
		justifyContent: 'center',
		marginBottom: 15,
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
	imagePreviewContainer: {
		position: 'relative',
		marginBottom: 20,
	},
	imagePreview: {
		width: '100%',
		height: 200,
		resizeMode: 'cover',
		borderRadius: 8,
	},
	removeButton: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 1,
	},
	imagePlaceholderContainer: {
		width: '100%',
		height: 200,
		backgroundColor: '#EFEFEF',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		marginBottom: 20,
	},
	imagePlaceholderText: {
		fontSize: 16,
		color: '#777',
	},
})
