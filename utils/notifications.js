import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { getPlan, getSettings } from "../storage/storage"
import { DAY_NAMES, isRest } from "./days"

// Local notifications are not available on web.
export const notificationsSupported = Platform.OS !== "web"

if (notificationsSupported) {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: false,
			shouldSetBadge: false
		})
	})
}

export async function ensurePermission() {
	if (!notificationsSupported) return false
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "Workout reminders",
			importance: Notifications.AndroidImportance.DEFAULT
		})
	}
	const current = await Notifications.getPermissionsAsync()
	if (current.granted) return true
	if (!current.canAskAgain) return false
	const asked = await Notifications.requestPermissionsAsync()
	return asked.granted
}

export const reminderMessage = (day, dayIndex) => {
	if (isRest(day)) {
		return { title: `😴 ${DAY_NAMES[dayIndex]}: Rest day`, body: "Recover well. Eat, sleep, and stretch." }
	}
	const names = day.exercises.slice(0, 4).map((e) => e.name)
	const more = day.exercises.length > 4 ? ` +${day.exercises.length - 4} more` : ""
	return {
		title: `🏋️ Today is ${day.label} Day`,
		body: names.length ? names.join(", ") + more : "Time to train!"
	}
}

// Cancels everything and re-creates one weekly reminder per weekday from the saved plan.
export async function syncReminders() {
	if (!notificationsSupported) return
	await Notifications.cancelAllScheduledNotificationsAsync()
	const settings = await getSettings()
	if (!settings.reminderEnabled) return
	if (!(await ensurePermission())) return
	const plan = await getPlan()
	for (let d = 0; d < 7; d++) {
		const { title, body } = reminderMessage(plan.days[d], d)
		await Notifications.scheduleNotificationAsync({
			content: { title, body, data: { screen: "Today" } },
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
				weekday: d + 1, // expo: 1 = Sunday
				hour: settings.hour,
				minute: settings.minute,
				channelId: "default"
			}
		})
	}
}

export async function sendTestNotification() {
	if (!(await ensurePermission())) return false
	const plan = await getPlan()
	const today = new Date().getDay()
	const { title, body } = reminderMessage(plan.days[today], today)
	await Notifications.scheduleNotificationAsync({
		content: { title, body, data: { screen: "Today" } },
		trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3, channelId: "default" }
	})
	return true
}
