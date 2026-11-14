import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNavigationContainerRef, DarkTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components"
import * as Notifications from "expo-notifications"
import React, { useEffect } from "react"
import EditDayScreen from "../screens/EditDayScreen"
import HistoryScreen from "../screens/HistoryScreen"
import LogWorkoutScreen from "../screens/LogWorkoutScreen"
import PlanScreen from "../screens/PlanScreen"
import ProgressScreen from "../screens/ProgressScreen"
import SettingsScreen from "../screens/SettingsScreen"
import TodayScreen from "../screens/TodayScreen"
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen"
import { notificationsSupported } from "../utils/notifications"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
const navigationRef = createNavigationContainerRef()

const TabBar = ({ navigation, state }) => (
	<BottomNavigation selectedIndex={state.index} onSelect={(index) => navigation.navigate(state.routeNames[index])}>
		<BottomNavigationTab title="Today" />
		<BottomNavigationTab title="Plan" />
		<BottomNavigationTab title="History" />
		<BottomNavigationTab title="Progress" />
		<BottomNavigationTab title="Settings" />
	</BottomNavigation>
)

const Tabs = () => (
	<Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
		<Tab.Screen name="Today" component={TodayScreen} />
		<Tab.Screen name="Plan" component={PlanScreen} />
		<Tab.Screen name="History" component={HistoryScreen} />
		<Tab.Screen name="Progress" component={ProgressScreen} />
		<Tab.Screen name="Settings" component={SettingsScreen} />
	</Tab.Navigator>
)

export default function RootNavigator() {
	// Tapping a reminder opens the Today tab
	useEffect(() => {
		if (!notificationsSupported) return
		const sub = Notifications.addNotificationResponseReceivedListener(() => {
			if (navigationRef.isReady()) navigationRef.navigate("Tabs", { screen: "Today" })
		})
		return () => sub.remove()
	}, [])

	return (
		<NavigationContainer ref={navigationRef} theme={DarkTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
				<Stack.Screen name="EditDay" component={EditDayScreen} options={{ title: "Edit Day" }} />
				<Stack.Screen name="LogWorkout" component={LogWorkoutScreen} options={{ title: "Log Workout" }} />
				<Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} options={{ title: "Workout" }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
