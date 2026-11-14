import AsyncStorage from "@react-native-async-storage/async-storage"
import { REST_LABEL } from "../utils/days"

const PLAN_KEY = "PLAN"

let idCounter = 0
export const newId = () => `${Date.now().toString(36)}-${(idCounter++).toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export const withIds = (exercises = []) => exercises.map((e) => ({ ...e, id: e.id || newId() }))

export const emptyPlan = () => {
	const days = {}
	for (let d = 0; d < 7; d++) days[d] = { label: REST_LABEL, exercises: [] }
	return { name: "My Plan", days }
}

// Normalise whatever is stored so screens can rely on all 7 days existing.
const normalizePlan = (raw) => {
	const plan = emptyPlan()
	if (!raw || typeof raw !== "object") return plan
	if (typeof raw.name === "string") plan.name = raw.name
	for (let d = 0; d < 7; d++) {
		const day = raw.days && raw.days[d]
		if (day && typeof day.label === "string") {
			plan.days[d] = { label: day.label, exercises: withIds(Array.isArray(day.exercises) ? day.exercises : []) }
		}
	}
	return plan
}

export async function getPlan() {
	try {
		const value = await AsyncStorage.getItem(PLAN_KEY)
		return normalizePlan(value ? JSON.parse(value) : null)
	} catch (e) {
		return emptyPlan()
	}
}

export async function savePlan(plan) {
	const normalized = normalizePlan(plan)
	await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(normalized))
	return normalized
}

export async function saveDay(dayIndex, day) {
	const plan = await getPlan()
	plan.days[dayIndex] = { label: day.label, exercises: withIds(day.exercises) }
	return savePlan(plan)
}

export async function applyTemplate(template) {
	const plan = { name: template.name, days: {} }
	for (let d = 0; d < 7; d++) {
		const day = template.days[d]
		plan.days[d] = { label: day.label, exercises: withIds(day.exercises) }
	}
	return savePlan(plan)
}

// ---------- Reminder settings ----------
const SETTINGS_KEY = "SETTINGS"
export const DEFAULT_SETTINGS = { reminderEnabled: false, hour: 7, minute: 30 }

export async function getSettings() {
	try {
		const value = await AsyncStorage.getItem(SETTINGS_KEY)
		return { ...DEFAULT_SETTINGS, ...(value ? JSON.parse(value) : {}) }
	} catch (e) {
		return { ...DEFAULT_SETTINGS }
	}
}

export async function saveSettings(settings) {
	const merged = { ...DEFAULT_SETTINGS, ...settings }
	await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
	return merged
}

// ---------- Workout logs ----------
// { id, date: "YYYY-MM-DD", dayLabel, entries: [{ exercise, sets: [{ reps, weight }] }], notes }
const LOGS_KEY = "WORKOUT_LOGS"

export const dateKey = (d = new Date()) => {
	const pad = (n) => String(n).padStart(2, "0")
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Newest first
export async function getLogs() {
	try {
		const value = await AsyncStorage.getItem(LOGS_KEY)
		const logs = value ? JSON.parse(value) : []
		return Array.isArray(logs) ? logs.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)) : []
	} catch (e) {
		return []
	}
}

export async function addLog(log) {
	const logs = await getLogs()
	const entry = { ...log, id: newId(), date: log.date || dateKey() }
	logs.push(entry)
	await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs))
	return entry
}

export async function deleteLog(id) {
	const logs = (await getLogs()).filter((l) => l.id !== id)
	await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}
