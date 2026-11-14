import { useFocusEffect } from "@react-navigation/native"
import { Button, Card, Text } from "@ui-kitten/components"
import React, { useCallback, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getLogs } from "../storage/storage"
import { exerciseHistory, exerciseNames, personalRecords } from "../utils/stats"

const CHART_HEIGHT = 140

function BarChart({ points }) {
	if (points.length === 0) return <Text appearance="hint">No weights logged for this exercise yet.</Text>
	const recent = points.slice(-10)
	const max = Math.max(...recent.map((p) => p.value))
	return (
		<View>
			<View style={styles.chart}>
				{recent.map((p, i) => (
					<View key={p.date + i} style={styles.barCol}>
						<Text category="c2">{p.value}</Text>
						<View style={[ styles.bar, { height: Math.max(4, (p.value / max) * CHART_HEIGHT) } ]} />
						<Text category="c2" appearance="hint">
							{p.date.slice(5)}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}

export default function ProgressScreen() {
	const [ logs, setLogs ] = useState([])
	const [ selected, setSelected ] = useState(null)

	useFocusEffect(
		useCallback(() => {
			let active = true
			getLogs().then((l) => active && setLogs(l))
			return () => {
				active = false
			}
		}, [])
	)

	const names = exerciseNames(logs)
	const current = selected && names.includes(selected) ? selected : names[0]
	const prs = personalRecords(logs)

	return (
		<SafeAreaView style={styles.screen} edges={[ "top" ]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text category="h1">Progress</Text>
				{names.length === 0 && (
					<Text appearance="hint" style={styles.section}>
						Log a workout with weights to see your progress here.
					</Text>
				)}

				{names.length > 0 && (
					<View>
						<Text category="h6" style={styles.section}>
							Top set weight
						</Text>
						<View style={styles.chips}>
							{names.map((n) => (
								<Button
									key={n}
									size="tiny"
									appearance={n === current ? "filled" : "outline"}
									style={styles.chip}
									onPress={() => setSelected(n)}
								>
									{n}
								</Button>
							))}
						</View>
						<Card>
							<BarChart points={exerciseHistory(logs, current)} />
						</Card>

						<Text category="h6" style={styles.section}>
							Personal records 🏆
						</Text>
						{Object.keys(prs)
							.sort()
							.map((name) => (
								<Card key={name} style={styles.pr}>
									<Text category="s1">{name}</Text>
									<Text appearance="hint">
										{prs[name].weight} × {prs[name].reps} · {prs[name].date}
									</Text>
								</Card>
							))}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	content: { padding: 24 },
	section: { marginTop: 20, marginBottom: 8 },
	chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
	chip: { marginRight: 8, marginBottom: 8 },
	chart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: CHART_HEIGHT + 40 },
	barCol: { alignItems: "center", flex: 1 },
	bar: { width: 16, backgroundColor: "#3366FF", borderRadius: 4, marginVertical: 4 },
	pr: { marginBottom: 8 }
})
