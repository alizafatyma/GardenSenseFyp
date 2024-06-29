import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import axios from 'axios';
import {BASE_URL} from '@env';
const signUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  //username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required').matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Invalid email format'
  ),
  pass: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});



  const SignUp = () => {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSignUp = async () => {
      try {
        await signUpSchema.validate({ fullName, email, pass });
    
        const response = await axios.post(`${BASE_URL}/auth/signup`, {
          fullName,
          email,
          pass,
        });
    
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
    
        const result = await response.data;
    
        console.log('Response data:', result);
    
        if (result === 'new') {
          setError('');
          navigation.navigate('HomeScreen'); // Navigate to HomeScreen after successful signup
        } else {
          setError('Signup failed');
        }
      } catch (error) {
        console.log('Error:', error);
        setError('An error occurred');
      }
    };
    
  
  
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/GardenSense-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={pass}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
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
    backgroundColor: '#388E3C',
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
    marginBottom: 12,
  },
});

export default SignUp;
