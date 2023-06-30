import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet } from 'react-native'

import {
	NavigationProp,
	useNavigation,
	useRoute,
} from '@react-navigation/native'

import { RootStackParamList } from '../types'
import {
	AddPlaceScreen,
	AllPlacesScreen,
	MapScreen,
	PlaceDetailScreen,
} from '../screens'
import { FormButton } from '../components'
import { Ionicons } from '@expo/vector-icons'
import { GlobalStyles } from '../constants'

const Tab = createBottomTabNavigator<RootStackParamList>()

export function BottomTabNavigator() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	const route = useRoute()

	const shouldShowTabBar = route.name !== 'Map'

	const handleGoBack = () => {
		navigation.goBack()
	}

	return (
		<Tab.Navigator
			screenOptions={({ route, navigation }) => ({
				headerStyle: { backgroundColor: GlobalStyles.colors.mainBackground },
				headerTintColor: GlobalStyles.colors.secondary500,
				headerTitleAlign: 'center',
				headerShown: true,
				tabBarShowLabel: false,
				tabBarStyle: {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				},
				headerLeft: ({ tintColor }) => (
					<FormButton
						isIconButton
						iconName="arrow-back"
						iconSize={27}
						iconColor={tintColor}
						onPress={handleGoBack}
						buttonContainerStyle={styles.buttonContainerStyle}
						iconPressedStyle={{ backgroundColor: 'white' }}
					/>
				),
			})}>
			<Tab.Screen
				name="Home"
				component={AllPlacesScreen}
				options={({ route }) => ({
					title: 'Your favorite places',
					tabBarLabel: 'Home',
					headerLeft: null,
					headerRight: ({ tintColor }) => (
						<FormButton
							isIconButton
							iconName="add"
							iconSize={29}
							iconColor={tintColor}
							iconPressedStyle={{ backgroundColor: 'white' }}
							onPress={() => {
								navigation.navigate('AddPlace')
							}}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={24} color={color} />
					),
				})}
			/>

			<Tab.Screen
				name="Details"
				component={PlaceDetailScreen}
				options={({ route }) => ({
					headerShown: true,
					title: 'Details',
					tabBarButton: () => null,
					tabBarStyle: {
						display: 'none',
					},
				})}
			/>

			<Tab.Screen
				name="AddPlace"
				component={AddPlaceScreen}
				options={({ route }) => ({
					headerShown: true,
					title: 'Add a new place',
					tabBarButton: () => null,
				})}
			/>

			<Tab.Screen
				name="Map"
				component={MapScreen}
				options={({ route }) => ({
					title: 'Map',
					tabBarLabel: 'Map',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="map" size={24} color={color} />
					),
					tabBarStyle: {
						display: 'none',
					},
				})}
			/>
		</Tab.Navigator>
	)
}

export default BottomTabNavigator

const styles = StyleSheet.create({
	buttonContainerStyle: {},
})
