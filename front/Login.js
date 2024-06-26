import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseURL = 'http://192.168.100.17:3000';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginSchema = Yup.object().shape({
    email: Yup.string().matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Invalid email'
    ).required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleLogin = async () => {
    try {
      await loginSchema.validate({ email, password });

      const userData = {
        email: email,
        password: password,
      };

      console.log('Sending login request...');
      setError(''); // Clear any previous error message
      const response = await axios.post('${baseURL}/login', userData);

      if (response.data.result && response.data.token) {
        // Handle successful login
        console.log('Login successful');
        setError('');
        // Save token to AsyncStorage for future use
        AsyncStorage.setItem('token', response.data.token);
        // Save user ID to AsyncStorage for future use
        AsyncStorage.setItem('userId', response.data.userId);
        // Navigate to HomeScreen
        navigation.navigate('HomeScreen');
      } else {
        setError('Invalid credentials'); // Or set error based on backend response
      }
    } catch (validationError) {
      setError(validationError.message);
    }
  };

  const switchToSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/GardenSense-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {/* Replace Text with TouchableOpacity for Sign Up */}
      <TouchableOpacity style={styles.signupButton} onPress={switchToSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background color
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    fontSize: 16,
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#3E2723',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  signupButton: {
    marginTop: 20,
  },
  signupText: {
    color: '#4CAF50',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Login;