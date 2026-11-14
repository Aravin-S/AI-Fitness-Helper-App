import { useNavigation } from "@react-navigation/native"
import { Button, Divider, Text } from "@ui-kitten/components"
import React, { useEffect, useState } from "react"
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { deleteLog, getLogs } from "../storage/storage"

export default function WorkoutDetailScreen({ route }) {
	const { logId } = route.params
	const navigation = useNavigation()
	const [ log, setLog ] = useState(null)

	useEffect(() => {
		getLogs().then((logs) => setLog(logs.find((l) => l.id === logId) || null))
	}, [ logId ])

	const remove = async () => {
		await deleteLog(logId)
		navigation.goBack()
	}

	const confirmDelete = () => {
		if (Platform.OS === "web") {
			if (window.confirm("Delete this workout?")) remove()
			return
		}
		Alert.alert("Delete workout?", "This can't be undone.", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Delete", style: "destructive", onPress: remove }
		])
	}

	if (!log) return null

	return (
		<SafeAreaView style={styles.screen} edges={[ "bottom" ]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text category="h4">
					{log.dayLabel} · {log.date}
				</Text>
				{log.entries.map((e) => (
					<View key={e.exercise} style={styles.entry}>
						<Text category="s1">{e.exercise}</Text>
						{e.sets.map((s, i) => (
							<Text key={i} appearance="hint">
								Set {i + 1}: {s.reps} reps{s.weight ? ` × ${s.weight}` : ""}
							</Text>
						))}
						<Divider style={styles.divider} />
					</View>
				))}
				{!!log.notes && (
					<View style={styles.entry}>
						<Text category="s1">Notes</Text>
						<Text>{log.notes}</Text>
					</View>
				)}
				<Button status="danger" appearance="outline" style={styles.delete} onPress={confirmDelete}>
					Delete workout
				</Button>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	content: { padding: 24 },
	entry: { marginTop: 16 },
	divider: { marginTop: 12 },
	delete: { marginTop: 32 }
})
