import Reac, { useEffect, useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'

import Toast from 'react-native-toast-message';
import styles from "../../assets/styles/login.styles"
import { Ionicons } from "@expo/vector-icons"
import { Link } from 'expo-router'
import { useAuthStore } from '../../store/authStore'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, token, isLoading, login } = useAuthStore();



  const handleLogin = async () => {
    // Handle signup logic here
    const result = await login(email, password)
    console.log("login result:", result);
    if (result.success === false) {
      Toast.show({
        type: 'error', // success | error | info
        text1: 'login Failed',
        text2: result.error,
        position: 'top',
        visibilityTime: 5000, // milliseconds
      });
    }

    if (result.success === true) {
      Toast.show({
        type: 'success', // success | error | info
        // text1: result.success,
        text2: 'Login Successful 👋',
        position: 'top',
        visibilityTime: 5000, // milliseconds
      });
    }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>

      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/i.png")}
            style={styles.illustrationImage}
            resizeMode='contain'
          />
        </View>
        <View style={styles.card}>
          <View style={styles.formContainer}>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (<ActivityIndicator color="#fff" />) : (<Text style={styles.buttonText} >Login</Text>)}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}> Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>

    </KeyboardAvoidingView>


  )
}

export default Login
