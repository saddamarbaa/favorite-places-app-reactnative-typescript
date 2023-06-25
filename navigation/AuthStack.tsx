import { createNativeStackNavigator } from '@react-navigation/native-stack'


import { RootStackParamList } from '../types'

import { Text, View } from 'react-native'
import React, { Component } from 'react'


const DetailScreen = () => {
	return (
		<View>
			<Text>AuthStack</Text>
		</View>
	)
}



const Stack = createNativeStackNavigator<RootStackParamList>()

export function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name="Details" component={DetailScreen} />
		</Stack.Navigator>
	)
}
