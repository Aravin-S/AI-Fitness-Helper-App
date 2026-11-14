import { useNavigation } from "@react-navigation/native"
import { Button, Input, Text } from "@ui-kitten/components"
import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getPlan, newId, saveDay } from "../storage/storage"
import { DAY_NAMES, LABEL_OPTIONS, REST_LABEL } from "../utils/days"
import { syncReminders } from "../utils/notifications"

export default function EditDayScreen({ route }) {
	const { dayIndex } = route.params
	const navigation = useNavigation()
	const [ label, setLabel ] = useState(REST_LABEL)
	const [ exercises, setExercises ] = useState([])
	const [ loaded, setLoaded ] = useState(false)

	useEffect(() => {
		navigation.setOptions({ title: DAY_NAMES[dayIndex] })
		getPlan().then((plan) => {
			const day = plan.days[dayIndex]
			setLabel(day.label)
			setExercises(day.exercises.map((e) => ({ ...e, sets: String(e.sets), reps: String(e.reps) })))
			setLoaded(true)
		})
	}, [ dayIndex, navigation ])

	const update = (id, field, value) => setExercises((list) => list.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
	const remove = (id) => setExercises((list) => list.filter((e) => e.id !== id))
	const add = () => setExercises((list) => [ ...list, { id: newId(), name: "", sets: "3", reps: "10" } ])

	const save = async () => {
		const cleaned = exercises
			.filter((e) => e.name.trim())
			.map((e) => ({ id: e.id, name: e.name.trim(), sets: parseInt(e.sets, 10) || 1, reps: e.reps.trim() || "10" }))
		await saveDay(dayIndex, { label: label.trim() || REST_LABEL, exercises: cleaned })
		await syncReminders().catch(() => {})
		navigation.goBack()
	}

	if (!loaded) return null

	return (
		<SafeAreaView style={styles.screen} edges={[ "bottom" ]}>
			<KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
					<Text category="h6">Day type</Text>
					<View style={styles.chips}>
						{LABEL_OPTIONS.map((opt) => (
							<Button
								key={opt}
								size="tiny"
								appearance={label === opt ? "filled" : "outline"}
								style={styles.chip}
								onPress={() => setLabel(opt)}
							>
								{opt}
							</Button>
						))}
					</View>
					<Input label="Or custom name" value={label} onChangeText={setLabel} style={styles.field} />

					<Text category="h6" style={styles.section}>
						Exercises
					</Text>
					{exercises.map((e) => (
						<View key={e.id} style={styles.exercise}>
							<Input placeholder="Exercise name" value={e.name} onChangeText={(v) => update(e.id, "name", v)} />
							<View style={styles.row}>
								<Input
									style={styles.small}
									label="Sets"
									keyboardType="number-pad"
									value={e.sets}
									onChangeText={(v) => update(e.id, "sets", v)}
								/>
								<Input style={styles.small} label="Reps" value={e.reps} onChangeText={(v) => update(e.id, "reps", v)} />
								<Button size="small" status="danger" appearance="ghost" onPress={() => remove(e.id)}>
									Remove
								</Button>
							</View>
						</View>
					))}
					<Button appearance="outline" onPress={add}>
						+ Add exercise
					</Button>
				</ScrollView>
				<View style={styles.footer}>
					<Button onPress={save}>Save</Button>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	flex: { flex: 1 },
	content: { padding: 24 },
	chips: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
	chip: { marginRight: 8, marginBottom: 8 },
	field: { marginTop: 8 },
	section: { marginTop: 24, marginBottom: 8 },
	exercise: { marginBottom: 16 },
	row: { flexDirection: "row", alignItems: "flex-end", marginTop: 8 },
	small: { flex: 1, marginRight: 8 },
	footer: { padding: 24, paddingTop: 8 }
})
