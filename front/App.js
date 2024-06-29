import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Signup from './Signup';
import HomeScreen from './HomeScreen';
import PlantIdentification from './PlantIdentification';
import PlantIdentificationResult from './PlantIdentificationResult';
import SavedList from './SavedList';
import ReminderScreen from './ReminderScreen'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PlantIdentification" component={PlantIdentification} />
        <Stack.Screen name="PlantIdentificationResult" component={PlantIdentificationResult} />
        <Stack.Screen name="SavedList" component={SavedList} />
        <Stack.Screen name="ReminderScreen" component={ReminderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


