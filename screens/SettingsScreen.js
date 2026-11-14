import { useFocusEffect } from "@react-navigation/native"
import { Button, Card, Text, Toggle } from "@ui-kitten/components"
import React, { useCallback, useState } from "react"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { getSettings, saveSettings } from "../storage/storage"
import { ensurePermission, notificationsSupported, sendTestNotification, syncReminders } from "../utils/notifications"

const pad = (n) => String(n).padStart(2, "0")

export default function SettingsScreen() {
	const [ settings, setSettings ] = useState(null)

	useFocusEffect(
		useCallback(() => {
			let active = true
			getSettings().then((s) => active && setSettings(s))
			return () => {
				active = false
			}
		}, [])
	)

	const change = async (patch) => {
		if (patch.reminderEnabled && !(await ensurePermission())) {
			Alert.alert("Notifications blocked", "Enable notifications for this app in your phone settings to get reminders.")
			return
		}
		const next = await saveSettings({ ...settings, ...patch })
		setSettings(next)
		await syncReminders()
	}

	const stepHour = (delta) => change({ hour: (settings.hour + delta + 24) % 24 })
	const stepMinute = (delta) => change({ minute: (settings.minute + delta + 60) % 60 })

	const test = async () => {
		const ok = await sendTestNotification()
		Alert.alert(ok ? "Sent" : "Not allowed", ok ? "A test reminder will arrive in a few seconds." : "Notification permission was denied.")
	}

	if (!settings) return null

	return (
		<SafeAreaView style={styles.screen} edges={[ "top" ]}>
			<ScrollView contentContainerStyle={styles.content}>
				<Text category="h1">Settings</Text>

				{!notificationsSupported && (
					<Text status="warning" style={styles.section}>
						Reminders only work on the iOS and Android apps, not in the browser.
					</Text>
				)}

				<Card style={styles.section}>
					<Toggle
						checked={settings.reminderEnabled}
						disabled={!notificationsSupported}
						onChange={(v) => change({ reminderEnabled: v })}
					>
						Daily workout reminder
					</Toggle>
					<Text appearance="hint" style={styles.hint}>
						Tells you each morning what day it is, e.g. "Today is Push Day".
					</Text>

					<Text category="s1" style={styles.section}>
						Reminder time
					</Text>
					<View style={styles.timeRow}>
						<View style={styles.stepper}>
							<Button size="small" appearance="outline" onPress={() => stepHour(1)}>
								+
							</Button>
							<Text category="h2">{pad(settings.hour)}</Text>
							<Button size="small" appearance="outline" onPress={() => stepHour(-1)}>
								−
							</Button>
						</View>
						<Text category="h2"> : </Text>
						<View style={styles.stepper}>
							<Button size="small" appearance="outline" onPress={() => stepMinute(5)}>
								+
							</Button>
							<Text category="h2">{pad(settings.minute)}</Text>
							<Button size="small" appearance="outline" onPress={() => stepMinute(-5)}>
								−
							</Button>
						</View>
					</View>
				</Card>

				<Button appearance="outline" style={styles.section} disabled={!notificationsSupported} onPress={test}>
					Send test notification
				</Button>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: "#222B45" },
	content: { padding: 24 },
	section: { marginTop: 20 },
	hint: { marginTop: 8 },
	timeRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 8 },
	stepper: { alignItems: "center", gap: 8 }
})
