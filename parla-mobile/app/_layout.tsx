import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000', // 🔥 critical
    card: '#000',
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={MyDarkTheme}>
        <TopTabs
          screenOptions={{
            swipeEnabled: true,
            tabBarStyle: { display: 'none' },
            sceneContainerStyle: {
              backgroundColor: '#000',
            },
          }}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}