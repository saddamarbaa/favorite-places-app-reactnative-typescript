import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import { GlobalStyles } from '../constants'
import { AddPlaceScreenProps } from '../types'
import { FormButton, FormInput, PlacesForm } from '../components'

export function AddPlaceScreen({ route, navigation }: AddPlaceScreenProps) {
	const [formState, setFormState] = useState({
		description: {
			value: '',
			isValid: true,
		},
		amount: {
			value: '',
			isValid: true,
		},
	})

	const { description, amount } = formState
	const id = route?.params?.id
	const isEditing = !!id

	const isFormInvalid =
		!description.isValid ||
		!amount.isValid ||
		description.value === '' ||
		amount.value === ''

	function redirectHandler() {
		navigation.goBack()
	}

	const dismissKeyboard = () => {
		Keyboard.dismiss()
	}

	function handleConfirm() {
		const parsedAmount = Number(amount.value)
		dismissKeyboard()

		// Reset the validation status
		setFormState((prevState) => ({
			...prevState,
			amount: {
				...prevState.amount,
				isValid: true,
			},
			description: {
				...prevState.description,
				isValid: true,
			},
		}))

		redirectHandler()
	}

	function handleCancel() {
		redirectHandler()
	}

	const handleRemoveExpense = () => {
		if (id) {
			// remove
			redirectHandler()
		}
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

		// Perform validation based on inputIdentifier
		if (inputIdentifier === 'amount') {
			const parsedAmount = Number(enteredValue)
			if (isNaN(parsedAmount) || parsedAmount < 1) {
				setFormState((prevState) => ({
					...prevState,
					amount: {
						...prevState.amount,
						isValid: false,
					},
				}))
			}
		} else if (inputIdentifier === 'description') {
			if (enteredValue.trim() === '') {
				setFormState((prevState) => ({
					...prevState,
					description: {
						...prevState.description,
						isValid: false,
					},
				}))
			}
		}
	}

	const handleInputChange = (
		inputIdentifier: 'date' | 'amount' | 'description',
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

	return <PlacesForm />

	return (
		<View style={styles.wrapper}>
			<View style={styles.form}>
				<FormInput
					value={amount.value}
					onChangeText={(text) => handleInputChange('amount', text)}
					placeholder=""
					label="Amount"
					keyboardType="decimal-pad"
					inputContainerStyle={amount.isValid ? styles.inputContainer : null}
					error={!amount.isValid}
					inputStyle={styles.input}
					errorMessage={!amount.isValid ? 'Invalid amount' : ''}
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
					autoCorrect={false} // default is true
					autoCapitalize="sentences"
				/>

				<View style={styles.buttonsWrapper}>
					<FormButton
						disabled={isFormInvalid}
						buttonTitle={isEditing ? 'Update' : 'Add'}
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

				{isEditing && (
					<View style={styles.deleteIconContainer}>
						<FormButton
							isIconButton
							iconName="trash"
							iconSize={30}
							iconColor={GlobalStyles.colors.error500}
							onPress={handleRemoveExpense}
							iconPressedStyle={{
								backgroundColor: GlobalStyles.colors.error50,
							}}
						/>
					</View>
				)}
			</View>
		</View>
	)
}

export default AddPlaceScreen

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
})
