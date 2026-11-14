import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Button, Card, Divider, Text } from "@ui-kitten/components"
import React, { useCallback, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { dateKey, getLogs, getPlan } from "../storage/storage"
import { DAY_NAMES, isRest } from "../utils/days"

export default function TodayScreen() {
	const [ plan, setPlan ] = useState(null)
	const [ doneToday, setDoneToday ] = useState(false)
	const navigation = useNavigation()
	const dayIndex = new Date().getDay()

	useFocusEffect(
		useCallback(() => {
			let active = true
			Promise.all([ getPlan(), getLogs() ]).then(([ p, logs ]) => {
				if (!active) return
				setPlan(p)
				setDoneToday(logs.some((l) => l.date === dateKey()))
			})
			return () => {
				active = false
			}
		}, [])
	)

	const today = plan && plan.days[dayIndex]

	return (
		<SafeAreaView style={styles.screen} edges={[ "top" ]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text appearance="hint">{DAY_NAMES[dayIndex]}</Text>
				{!today ? null : isRest(today) ? (
					<View>
						<Text category="h1" style={styles.title}>
							Rest Day 😴
						</Text>
						<Text appearance="hint">Recover well. Eat, sleep, and stretch.</Text>
					</View>
				) : (
					<View>
						<Text category="h1" style={styles.title}>
							{today.label} Day 💪
						</Text>
						{today.exercises.length === 0 ? (
							<Text appearance="hint">No exercises yet. Add some in the Plan tab.</Text>
						) : (
							<Card>
								{today.exercises.map((e, i) => (
									<View key={e.id}>
										{i > 0 && <Divider style={styles.divider} />}
										<Text category="s1">{e.name}</Text>
										<Text appearance="hint">
											{e.sets} sets × {e.reps} reps
										</Text>
									</View>
								))}
							</Card>
						)}
						{doneToday && <Text status="success" style={styles.title}>Workout logged today ✓</Text>}
						<Button style={styles.title} onPress={() => navigation.navigate("LogWorkout", { dayIndex })}>
							{doneToday ? "Log another workout" : "Start workout"}
						</Button>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	content: { padding: 24 },
	title: { marginVertical: 12 },
	divider: { marginVertical: 10 }
})
