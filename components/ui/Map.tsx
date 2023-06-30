import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps'

interface MapProps {
	mapRegion: Region
	handleMapRegionChange?: ((region: Region) => void) | undefined
	selectedLocation: { latitude: number; longitude: number } | null
	mapContainerStyle?: StyleProp<ViewStyle>
	onPress?: ((event: MapPressEvent) => void) | undefined
}

export const Map: React.FC<MapProps> = ({
	mapRegion = {
		latitude: 34.0479,
		longitude: 100.6197,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	},
handleMapRegionChange = () => {},
	selectedLocation,
	mapContainerStyle,
	onPress = () => {},
}) => {
	return (
		<View style={[styles.mapContainer, mapContainerStyle]}>
			<MapView
				style={styles.map}
				region={mapRegion}
				onPress={onPress}
				onRegionChange={handleMapRegionChange}>
				{selectedLocation && (
					<Marker
						coordinate={{
							latitude: selectedLocation.latitude,
							longitude: selectedLocation.longitude,
						}}
					/>
				)}
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	mapContainer: {
		height: 200,
		marginBottom: 10,
		borderRadius: 8,
		overflow: 'hidden',
	},
	map: {
		flex: 1,
	},
})

export default React.memo(Map)
