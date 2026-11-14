import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Button, Card, Divider, Text } from "@ui-kitten/components"
import React, { useCallback, useState } from "react"
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { applyTemplate, getPlan } from "../storage/storage"
import { DAY_NAMES, WEEK_ORDER, isRest } from "../utils/days"
import { syncReminders } from "../utils/notifications"
import { TEMPLATES } from "../utils/templates"

const confirm = (title, message, onConfirm) => {
	if (Platform.OS === "web") {
		if (window.confirm(`${title}\n${message}`)) onConfirm()
		return
	}
	Alert.alert(title, message, [ { text: "Cancel", style: "cancel" }, { text: "Replace", style: "destructive", onPress: onConfirm } ])
}

export default function PlanScreen() {
	const [ plan, setPlan ] = useState(null)
	const navigation = useNavigation()

	useFocusEffect(
		useCallback(() => {
			let active = true
			getPlan().then((p) => active && setPlan(p))
			return () => {
				active = false
			}
		}, [])
	)

	const useTemplate = (template) =>
		confirm("Use template?", `This replaces your current plan with "${template.name}".`, async () => {
			setPlan(await applyTemplate(template))
			syncReminders().catch(() => {})
		})

	return (
		<SafeAreaView style={styles.screen} edges={[ "top" ]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text category="h1">Weekly Plan</Text>
				{plan && <Text appearance="hint">{plan.name}</Text>}

				<Text category="h6" style={styles.section}>
					Quick start templates
				</Text>
				<View style={styles.templates}>
					{TEMPLATES.map((t) => (
						<Button key={t.name} size="small" appearance="outline" style={styles.templateBtn} onPress={() => useTemplate(t)}>
							{t.name}
						</Button>
					))}
				</View>

				<Text category="h6" style={styles.section}>
					Days
				</Text>
				<Card style={styles.card}>
					{plan &&
						WEEK_ORDER.map((d, i) => {
							const day = plan.days[d]
							return (
								<View key={d}>
									{i > 0 && <Divider />}
									<Button
										appearance="ghost"
										style={styles.dayRow}
										onPress={() => navigation.navigate("EditDay", { dayIndex: d })}
									>
										{`${DAY_NAMES[d]} — ${day.label}${isRest(day) ? "" : ` (${day.exercises.length})`}`}
									</Button>
								</View>
							)
						})}
				</Card>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	content: { padding: 24 },
	section: { marginTop: 24, marginBottom: 8 },
	templates: { flexDirection: "row", flexWrap: "wrap" },
	templateBtn: { marginRight: 8, marginBottom: 8 },
	card: { padding: 0 },
	dayRow: { justifyContent: "flex-start" }
})
