import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Card, Text } from "@ui-kitten/components"
import React, { useCallback, useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getLogs, getPlan } from "../storage/storage"
import { computeStreak, logVolume } from "../utils/stats"

export default function HistoryScreen() {
	const [ logs, setLogs ] = useState([])
	const [ streak, setStreak ] = useState(0)
	const navigation = useNavigation()

	useFocusEffect(
		useCallback(() => {
			let active = true
			Promise.all([ getLogs(), getPlan() ]).then(([ l, plan ]) => {
				if (!active) return
				setLogs(l)
				setStreak(computeStreak(l, plan))
			})
			return () => {
				active = false
			}
		}, [])
	)

	return (
		<SafeAreaView style={styles.screen} edges={[ "top" ]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text category="h1">History</Text>
				<View style={styles.stats}>
					<Card style={styles.stat}>
						<Text category="h2">🔥 {streak}</Text>
						<Text appearance="hint">day streak</Text>
					</Card>
					<Card style={styles.stat}>
						<Text category="h2">{logs.length}</Text>
						<Text appearance="hint">workouts</Text>
					</Card>
				</View>

				{logs.length === 0 && <Text appearance="hint">No workouts yet. Start one from the Today tab.</Text>}
				{logs.map((log) => (
					<TouchableOpacity key={log.id} onPress={() => navigation.navigate("WorkoutDetail", { logId: log.id })}>
						<Card style={styles.log}>
							<Text category="s1">
								{log.date} · {log.dayLabel}
							</Text>
							<Text appearance="hint">
								{log.entries.length} exercises · volume {Math.round(logVolume(log))}
							</Text>
						</Card>
					</TouchableOpacity>
				))}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	content: { padding: 24 },
	stats: { flexDirection: "row", marginVertical: 16, gap: 12 },
	stat: { flex: 1 },
	log: { marginBottom: 10 }
})
