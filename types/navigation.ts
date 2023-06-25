import { CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack'
import {
	DrawerNavigationProp,
	DrawerScreenProps,
} from '@react-navigation/drawer'

// Define the types for your stack navigator screens
export type RootStackParamList = {
	AuthenticatedStack: undefined
	Home: undefined
	Map: undefined
	Details: {
		id: string | number
		otherParam?: string
	}
	AddPlace: { id?: string }
}

export type AuthenticatedStackScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'AuthenticatedStack'
>

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>

export type DetailsScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'Details'
>

export type AddPlaceScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'AddPlace'
>
