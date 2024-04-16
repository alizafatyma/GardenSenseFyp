/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login'; // Import Login component
import SignUp from './Signup'; // Import SignUp component

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;*/

// PlantWidget.js

// PlantWidget.js





import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

// Sample plant images (replace with your own dataset)
const plantImages = [
  require('./assets/plant1.jpg'),
  require('./assets/plant2.jpg'),
  require('./assets/plant3.jpg'),
  // Add more images as needed
];

const RandomPlantWidget = () => {
  const [randomImageIndex, setRandomImageIndex] = useState(0);

  useEffect(() => {
    // Generate a random index to select a random plant image
    const randomIndex = Math.floor(Math.random() * plantImages.length);
    setRandomImageIndex(randomIndex);
  }, []);

  const handlePress = () => {
    // When the user taps on the widget, generate a new random image
    const randomIndex = Math.floor(Math.random() * plantImages.length);
    setRandomImageIndex(randomIndex);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View>
        <Image
          source={plantImages[randomImageIndex]}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </TouchableOpacity>
  );
};
