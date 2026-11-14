// JS Date.getDay(): 0 = Sunday ... 6 = Saturday
export const DAY_NAMES = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]

// Display order for the planner (week starts on Monday)
export const WEEK_ORDER = [ 1, 2, 3, 4, 5, 6, 0 ]

export const REST_LABEL = "Rest"

export const LABEL_OPTIONS = [ "Push", "Pull", "Legs", "Upper", "Lower", "Full Body", "Cardio", REST_LABEL ]

export const isRest = (day) => !day || day.label === REST_LABEL
