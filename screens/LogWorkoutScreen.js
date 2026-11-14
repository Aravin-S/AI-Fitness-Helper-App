import { useNavigation } from "@react-navigation/native"
import { Button, Input, Text } from "@ui-kitten/components"
import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { addLog, getPlan } from "../storage/storage"

export default function LogWorkoutScreen({ route }) {
	const { dayIndex } = route.params
	const navigation = useNavigation()
	const [ label, setLabel ] = useState("")
	const [ entries, setEntries ] = useState(null)
	const [ notes, setNotes ] = useState("")

	useEffect(() => {
		getPlan().then((plan) => {
			const day = plan.days[dayIndex]
			setLabel(day.label)
			setEntries(
				day.exercises.map((e) => ({
					exercise: e.name,
					sets: Array.from({ length: e.sets }, () => ({ reps: String(parseInt(e.reps, 10) || ""), weight: "" }))
				}))
			)
		})
	}, [ dayIndex ])

	const setValue = (ei, si, field, value) =>
		setEntries((list) =>
			list.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((s, j) => (j !== si ? s : { ...s, [field]: value })) }))
		)

	const addSet = (ei) =>
		setEntries((list) => list.map((e, i) => (i !== ei ? e : { ...e, sets: [ ...e.sets, { reps: "", weight: "" } ] })))

	const save = async () => {
		const cleaned = entries
			.map((e) => ({
				exercise: e.exercise,
				sets: e.sets
					.filter((s) => Number(s.reps) > 0)
					.map((s) => ({ reps: Number(s.reps), weight: Number(s.weight) || 0 }))
			}))
			.filter((e) => e.sets.length > 0)
		await addLog({ dayLabel: label, entries: cleaned, notes: notes.trim() })
		navigation.navigate("Tabs", { screen: "History" })
	}

	if (!entries) return null

	return (
		<SafeAreaView style={styles.screen} edges={[ "bottom" ]}>
			<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<Text category="h4">{label} workout</Text>
					{entries.map((e, ei) => (
						<View key={e.exercise + ei} style={styles.exercise}>
							<Text category="s1">{e.exercise}</Text>
							{e.sets.map((s, si) => (
								<View key={si} style={styles.row}>
									<Text style={styles.setNo} appearance="hint">
										{si + 1}
									</Text>
									<Input
										style={styles.input}
										placeholder="reps"
										keyboardType="number-pad"
										value={s.reps}
										onChangeText={(v) => setValue(ei, si, "reps", v)}
									/>
									<Input
										style={styles.input}
										placeholder="weight"
										keyboardType="decimal-pad"
										value={s.weight}
										onChangeText={(v) => setValue(ei, si, "weight", v)}
									/>
								</View>
							))}
							<Button size="tiny" appearance="ghost" onPress={() => addSet(ei)}>
								+ Add set
							</Button>
						</View>
					))}
					{entries.length === 0 && <Text appearance="hint">This day has no exercises. You can still add notes.</Text>}
					<Input label="Notes" multiline value={notes} onChangeText={setNotes} style={styles.exercise} />
				</ScrollView>
				<View style={styles.footer}>
					<Button onPress={save}>Finish workout</Button>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	flex: { flex: 1 },
	content: { padding: 24 },
	exercise: { marginTop: 20 },
	row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
	setNo: { width: 24 },
	input: { flex: 1, marginRight: 8 },
	footer: { padding: 24, paddingTop: 8 }
})
