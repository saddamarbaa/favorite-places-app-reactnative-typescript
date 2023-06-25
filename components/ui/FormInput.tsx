import React from 'react'
import {
	View,
	TextInput,
	StyleSheet,
	Text,
	StyleProp,
	ViewStyle,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'

type FormInputProps = {
	error?: boolean
	errorMessage?: string
	value: string
	onChangeText: (text: string) => void
	placeholder: string
	iconType?: React.ComponentProps<typeof AntDesign>['name']
	inputStyle?: StyleProp<ViewStyle>
	inputContainerStyle?: StyleProp<ViewStyle>
	label?: string
} & TextInput['props']

export function FormInput({
	error,
	errorMessage,
	value,
	onChangeText,
	placeholder,
	inputStyle,
	inputContainerStyle,
	label,
	iconType,
	...rest
}: FormInputProps) {
	return (
		<View style={styles.control}>
			{errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
			{!errorMessage && label && <Text style={styles.label}>{label}</Text>}
			<View style={styles.inputWrapper}>
				<View
					style={[
						error ? styles.inputField : styles.inputContainer,
						inputContainerStyle,
					]}>
					{iconType && (
						<View style={error ? styles.iconStyleOnerror : styles.iconStyle}>
							<AntDesign name={iconType} size={25} color="#666" />
						</View>
					)}
					<TextInput
						placeholder={error ? '' : placeholder}
						style={[styles.input, inputStyle]}
						numberOfLines={1}
						autoFocus
						placeholderTextColor="#666"
						value={value}
						onChangeText={onChangeText}
						{...rest}
					/>
				</View>
			</View>
		</View>
	)
}

export default FormInput

const styles = StyleSheet.create({
	control: {
		marginTop: 10,
		marginBottom: 10,
		color: '#1c1e21',
		width: '100%',
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	inputContainer: {
		flex: 1,
		height: '100%',
		maxHeight: 50,
		borderColor: '#ccc',
		borderRadius: 8,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	iconStyle: {
		padding: 10,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRightColor: '#ccc',
		borderRightWidth: 1,
		width: 50,
	},
	iconStyleOnerror: {
		padding: 10,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRightColor: '#ff9700',
		borderRightWidth: 1,
		width: 50,
	},
	input: {
		padding: 10,
		flex: 1,
		fontSize: 16,
		// fontFamily: 'Lato-Regular',
		color: '#333',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	inputField: {
		marginTop: 5,
		marginBottom: 10,
		width: '100%',
		height: '100%',
		maxHeight: 50,
		borderColor: 'red',
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffc2c2',
		borderRadius: 5,
	},
	label: {
		width: '100%',
		fontSize: 17,
		fontWeight: 'bold',
		paddingHorizontal: 2,
		marginBottom: 5,
	},
	error: {
		width: '100%',
		// color: 'red',
		color: '#ff9700',
		fontWeight: 'bold',
		marginBottom: 0,
		textAlign: 'right',
		paddingHorizontal: 13,
	},
})
