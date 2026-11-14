import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DarkTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components"
import React from "react"
import EditDayScreen from "../screens/EditDayScreen"
import PlanScreen from "../screens/PlanScreen"
import TodayScreen from "../screens/TodayScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const TabBar = ({ navigation, state }) => (
	<BottomNavigation selectedIndex={state.index} onSelect={(index) => navigation.navigate(state.routeNames[index])}>
		<BottomNavigationTab title="Today" />
		<BottomNavigationTab title="Plan" />
	</BottomNavigation>
)

const Tabs = () => (
	<Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
		<Tab.Screen name="Today" component={TodayScreen} />
		<Tab.Screen name="Plan" component={PlanScreen} />
	</Tab.Navigator>
)

export default function RootNavigator() {
	return (
		<NavigationContainer theme={DarkTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
				<Stack.Screen name="EditDay" component={EditDayScreen} options={{ title: "Edit Day" }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
