import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { PLACES } from '../../utils'
import { PlaceT, RootStackParamList } from '../../types'
import PlaceItem from './PlaceItem'
import { Card, FormButton } from '../ui'

export function PlacesList() {
	const [places, setPlaces] = useState(PLACES)
	const [refreshing, setRefreshing] = useState(false)
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const handleRefresh = () => {
		setRefreshing((prevState) => !prevState)
	}

	const handleReRedirect = () => {
		navigation.navigate('AddPlace')
	}

	const myItemSeparator = () => {
		return <View style={{ backgroundColor: 'grey' }} />
	}

	const renderEmptyPlace = () => (
		<View style={styles.emptyContainer}>
			<Card style={styles.card}>
				<Text style={styles.emptyText}>
					No favorite place found. Start adding some!
				</Text>
				<FormButton buttonTitle="ADD NEW" onPress={handleReRedirect} />
			</Card>
		</View>
	)

	const renderPlaceItem = (place: PlaceT) => {
		return <PlaceItem {...place} />
	}

	return (
		<View style={styles.container}>
			<FlatList
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical={false}
				data={places}
				renderItem={({ item, index, separators }) => renderPlaceItem(item)}
				keyExtractor={(item) => item.id}
				ItemSeparatorComponent={myItemSeparator}
				ListEmptyComponent={renderEmptyPlace}
				refreshing={refreshing}
				onRefresh={handleRefresh}
			/>
		</View>
	)
}

export default PlacesList

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	card: {
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		padding: 20,
		marginBottom: 20,
	},
	emptyContainer: {
		flex: 1,
		margin: 10,
		marginTop: 100,
		padding: 4,
	},
	emptyText: {
		fontSize: 17,
		textAlign: 'center',
	},
})
