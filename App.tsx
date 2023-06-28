import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'

import { AuthProvider as ContextProvider } from './globalStates'
import { AppNavigator } from './navigation'

export default function App() {
	return (
		<>
			<SafeAreaProvider>
				<StatusBar style="dark" />
				<ContextProvider>
					<AppNavigator />
					<Toast />
				</ContextProvider>
			</SafeAreaProvider>
		</>
	)
}
