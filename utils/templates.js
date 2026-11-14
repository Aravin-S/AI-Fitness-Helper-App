import { REST_LABEL } from "./days"

const ex = (name, sets, reps) => ({ name, sets, reps })

const PUSH = [
	ex("Bench Press", 4, "8-10"),
	ex("Overhead Press", 3, "8-10"),
	ex("Incline Dumbbell Press", 3, "10-12"),
	ex("Lateral Raise", 3, "12-15"),
	ex("Triceps Pushdown", 3, "10-12")
]
const PULL = [
	ex("Pull-Up", 4, "6-10"),
	ex("Barbell Row", 4, "8-10"),
	ex("Seated Cable Row", 3, "10-12"),
	ex("Face Pull", 3, "12-15"),
	ex("Dumbbell Curl", 3, "10-12")
]
const LEGS = [
	ex("Squat", 4, "6-8"),
	ex("Romanian Deadlift", 3, "8-10"),
	ex("Leg Press", 3, "10-12"),
	ex("Leg Curl", 3, "10-12"),
	ex("Calf Raise", 4, "12-15")
]
const UPPER = [
	ex("Bench Press", 4, "6-8"),
	ex("Barbell Row", 4, "6-8"),
	ex("Overhead Press", 3, "8-10"),
	ex("Lat Pulldown", 3, "10-12"),
	ex("Biceps Curl", 2, "10-12"),
	ex("Triceps Extension", 2, "10-12")
]
const LOWER = [
	ex("Squat", 4, "6-8"),
	ex("Romanian Deadlift", 3, "8-10"),
	ex("Walking Lunge", 3, "10-12"),
	ex("Leg Curl", 3, "10-12"),
	ex("Calf Raise", 4, "12-15")
]
const FULL = [
	ex("Squat", 3, "8-10"),
	ex("Bench Press", 3, "8-10"),
	ex("Barbell Row", 3, "8-10"),
	ex("Overhead Press", 3, "8-10"),
	ex("Plank", 3, "45s")
]

const day = (label, exercises = []) => ({ label, exercises })

// Keys are weekday numbers (0 = Sunday)
export const TEMPLATES = [
	{
		name: "Push / Pull / Legs",
		days: {
			1: day("Push", PUSH),
			2: day("Pull", PULL),
			3: day("Legs", LEGS),
			4: day("Push", PUSH),
			5: day("Pull", PULL),
			6: day("Legs", LEGS),
			0: day(REST_LABEL)
		}
	},
	{
		name: "Upper / Lower",
		days: {
			1: day("Upper", UPPER),
			2: day("Lower", LOWER),
			3: day(REST_LABEL),
			4: day("Upper", UPPER),
			5: day("Lower", LOWER),
			6: day(REST_LABEL),
			0: day(REST_LABEL)
		}
	},
	{
		name: "Full Body (3 days)",
		days: {
			1: day("Full Body", FULL),
			2: day(REST_LABEL),
			3: day("Full Body", FULL),
			4: day(REST_LABEL),
			5: day("Full Body", FULL),
			6: day(REST_LABEL),
			0: day(REST_LABEL)
		}
	}
]
