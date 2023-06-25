import React from 'react'
import { View, StyleSheet, Pressable, Image, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { Place } from '../../models'
import { Card } from '../ui'
import { RootStackParamList } from '../../types'
import { GlobalStyles } from '../../constants'

interface Props extends Place {}

const PlaceItem: React.FC<Props> = ({
	id,
	title,
	imageUrl,
	address,
	description,
	location,
	averageRating,
	reviewCount,
}) => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const handlePress = (id?: string) => {
		if (id) {
			navigation.navigate('Details', {
				id: id,
			})
		} else {
			navigation.navigate('Details')
		}
	}

	return (
		<Card style={styles.card}>
			<Pressable
				onPress={() => {
					handlePress(id)
				}}
				style={({ pressed }) => [
					styles.container,
					pressed && styles.pressedItem,
				]}
				android_ripple={{ color: '#ccc' }}>
				<Image source={{ uri: imageUrl }} style={styles.image} />
				<View style={styles.content}>
					<Text style={styles.title}>{title}</Text>

					<View style={styles.addressContainer}>
						<MaterialCommunityIcons
							name="map-marker-alert"
							size={20}
							color="black"
						/>
						<Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
							{address}
						</Text>
					</View>

					<View style={styles.reviewContent}>
						<MaterialCommunityIcons
							name="star"
							size={20}
							color={GlobalStyles.colors.secondary500}
						/>
						<Text style={styles.rating}>{averageRating.toFixed(1)}</Text>
						<Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
					</View>
				</View>
			</Pressable>
		</Card>
	)
}

const styles = StyleSheet.create({
	card: {
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		padding: 0,
		marginBottom: 20,
	},
	container: {
		flexDirection: 'row',
	},
	content: {
		flex: 1,
		marginLeft: 10,
		padding: 10,
	},
	title: {
		fontWeight: 'bold',
		color: GlobalStyles.colors.secondary500,
		fontSize: 17,
		marginBottom: 8,
	},
	address: {
		flex: 1,
		marginLeft: 3,
		fontSize: 16,
	},
	pressedItem: {
		opacity: 0.5,
	},
	addressContainer: {
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center',
	},
	reviewContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rating: {
		fontWeight: 'bold',
		color: GlobalStyles.colors.secondary500,
		marginHorizontal: 4,
	},
	reviewCount: {
		fontSize: 17,
		color: '#888',
		marginLeft: 4,
	},
	image: {
		width: 130,
		minHeight: 100,
		height: '100%',
		borderRadius: 8,
	},
})

export default PlaceItem
