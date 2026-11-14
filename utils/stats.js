import { dateKey } from "../storage/storage"
import { isRest } from "./days"

const topWeight = (entry) => Math.max(0, ...entry.sets.map((s) => Number(s.weight) || 0))

// Consecutive training days completed. Planned rest days neither extend nor break the streak,
// and today doesn't break it until the day is over.
export function computeStreak(logs, plan) {
	const logged = new Set(logs.map((l) => l.date))
	const cursor = new Date()
	let streak = 0
	for (let i = 0; i < 400; i++) {
		const key = dateKey(cursor)
		if (logged.has(key)) streak++
		else if (i > 0 && !isRest(plan.days[cursor.getDay()])) break
		cursor.setDate(cursor.getDate() - 1)
	}
	return streak
}

// { [exercise]: { weight, reps, date } } — heaviest set ever logged
export function personalRecords(logs) {
	const prs = {}
	for (const log of logs) {
		for (const entry of log.entries) {
			for (const set of entry.sets) {
				const weight = Number(set.weight) || 0
				if (weight > 0 && (!prs[entry.exercise] || weight > prs[entry.exercise].weight)) {
					prs[entry.exercise] = { weight, reps: Number(set.reps) || 0, date: log.date }
				}
			}
		}
	}
	return prs
}

export const exerciseNames = (logs) => {
	const names = new Set()
	logs.forEach((l) => l.entries.forEach((e) => names.add(e.exercise)))
	return [ ...names ].sort()
}

// Oldest → newest top-set weight per session for one exercise
export function exerciseHistory(logs, name) {
	const points = []
	for (const log of [ ...logs ].reverse()) {
		const entry = log.entries.find((e) => e.exercise === name)
		if (entry) {
			const w = topWeight(entry)
			if (w > 0) points.push({ date: log.date, value: w })
		}
	}
	return points
}

export const logVolume = (log) =>
	log.entries.reduce((sum, e) => sum + e.sets.reduce((s, set) => s + (Number(set.reps) || 0) * (Number(set.weight) || 0), 0), 0)
