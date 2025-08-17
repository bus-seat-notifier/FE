import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RouteSelectionScreen from '../screens/RouteSelectionScreen';
import TimeSelectionScreen from '../screens/TimeSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import AlertSetupScreen from '../screens/AlertSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Welcome: undefined;
  RouteSelection: undefined;
  TimeSelection: {
    departure: string;
    arrival: string;
    date: string;
    routeId: string;
  };
  Login: {
    departure: string;
    arrival: string;
    date: string;
    time: string;
    routeId: string;
    scheduleId: string;
  };
  AlertSetup: {
    departure: string;
    arrival: string;
    date: string;
    time: string;
    routeId: string;
    scheduleId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  Home: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RouteSelection" component={RouteSelectionScreen} />
        <Stack.Screen name="TimeSelection" component={TimeSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AlertSetup" component={AlertSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
