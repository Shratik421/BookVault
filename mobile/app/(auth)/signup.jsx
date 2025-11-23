import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import styles from "../../assets/styles/signup.styles"
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons"
import { Link, router } from 'expo-router'
import axios from 'axios';
import { BASE_URL } from '../../utils/BASE_URL';
import { useAuthStore } from '../../store/authStore'
const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, user,token, isLoading } = useAuthStore();

  console.log("Auth Store - User:", user);
  console.log("Auth Store - Token:", token);
  const handleSignup = async () => {

    // Handle signup logic here
    const result = await register(username, email, password)
    console.log("Signup result:", result);
    if (result.success === false) {
      Toast.show({
        type: 'error', // success | error | info
    text1: 'Signup Failed',
      text2: result.error,
        position: 'top',
        visibilityTime: 5000, // milliseconds
      });
    }
    
    if(result.success === true){ 
      Toast.show({
        type: 'success', // success | error | info
        // text1: result.success,
        text2: 'Register Successful 👋',
        position: 'top',
        visibilityTime: 5000, // milliseconds
      });
    }

  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started!</Text>
          </View>
          <View style={styles.formContainer}>
            {/* UserName input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  autoCapitalize="none"
                  autoComplete='none'
                  value={username}
                  onChangeText={setUsername}
                />
              </View>
            </View>
            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  autoComplete='none'
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                {/* Left Icon */}
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"

                  value={password}
                  autoComplete='none'
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
              {isLoading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText} >Signup</Text>)}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>

              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}> Log In</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Signup
