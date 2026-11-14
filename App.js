import * as eva from "@eva-design/eva"
import { ApplicationProvider } from "@ui-kitten/components"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import RootNavigator from "./navigation/RootNavigator"

export default function App() {
	return (
		<SafeAreaProvider>
			<ApplicationProvider {...eva} theme={eva.dark}>
				<StatusBar style="light" />
				<RootNavigator />
			</ApplicationProvider>
		</SafeAreaProvider>
	)
}
