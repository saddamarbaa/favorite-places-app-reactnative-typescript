import {
	Alert,
	Image,
	Linking,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	launchCameraAsync,
	useCameraPermissions,
	PermissionStatus,
} from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

import { FormButton } from '../ui'
import { GlobalStyles } from '../../constants'

interface ImagePickerProps {
	selectedImage: string | null
	setSelectedImage: (image: string | null) => void
	imageError: boolean
	setImageError: (error: boolean) => void
}

export function ImagePicker({
	selectedImage,
	setSelectedImage,
	imageError,
	setImageError,
}: ImagePickerProps) {
	const [cameraPermissionInformation, requestPermission] =
		useCameraPermissions()

	useEffect(() => {
		requestPermission()
	}, [])

	async function verifyPermissions() {
		if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
			Alert.alert(
				'Camera Permission Denied',
				'Please grant camera permission to capture images. You can enable camera permission in the device settings.',
				[
					{ text: 'Cancel', style: 'cancel' },
					{ text: 'Open Settings', onPress: openAppSettings },
				],
			)
			return false
		}

		return true
	}

	function openAppSettings() {
		if (Platform.OS === 'ios') {
			Linking.openURL('app-settings:')
		} else {
			Linking.openSettings()
		}
	}

	async function takeImageHandler() {
		const hasPermission = await verifyPermissions()

		if (!hasPermission) {
			return
		}

		try {
			const image = await launchCameraAsync({
				allowsEditing: true,
				aspect: [16, 9],
				quality: 0.5,
			})

			if (!image.canceled) {
				setSelectedImage(image.assets[0].uri)
				setImageError(false)
			} else {
				console.log('Image capture cancelled')
			}
		} catch (error) {
			console.log('Error occurred during image capture:', error)
		}
	}

	const handleImageRemove = () => {
		setSelectedImage(null)
		setImageError(false)
	}

	return (
		<>
			<FormButton
				buttonTitle="Capture Image"
				btnType="camera"
				buttonContainerStyle={styles.buttonContainer}
				iconSize={18}
				iconColor={GlobalStyles.colors.secondary500}
				buttonTextStyle={{
					color: GlobalStyles.colors.secondary500,
				}}
				buttonPressedStyle={{
					opacity: 0.3,
				}}
				onPress={takeImageHandler}
			/>
			{selectedImage && !imageError ? (
				<View style={styles.imagePreviewContainer}>
					<Image
						source={{ uri: selectedImage }}
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
		</>
	)
}

export default ImagePicker

const styles = StyleSheet.create({
	buttonContainer: {
		marginVertical: 10,
		alignSelf: 'center',
		borderWidth: 1,
		borderColor: GlobalStyles.colors.secondary500,
		borderRadius: 10,
		backgroundColor: 'white',
	},
	imagePreviewContainer: {
		position: 'relative',
		marginBottom: 20,
	},
	imagePreview: {
		width: '100%',
		height: 200,
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
		marginBottom: 10,
	},
	imagePlaceholderText: {
		fontSize: 16,
		color: '#777',
	},
})
