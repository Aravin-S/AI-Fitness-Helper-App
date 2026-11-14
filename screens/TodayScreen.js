import { useFocusEffect } from "@react-navigation/native"
import { Card, Divider, Text } from "@ui-kitten/components"
import React, { useCallback, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getPlan } from "../storage/storage"
import { DAY_NAMES, isRest } from "../utils/days"

export default function TodayScreen() {
	const [ plan, setPlan ] = useState(null)
	const dayIndex = new Date().getDay()

	useFocusEffect(
		useCallback(() => {
			let active = true
			getPlan().then((p) => active && setPlan(p))
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
