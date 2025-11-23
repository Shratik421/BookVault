import axios from 'axios';
import { BASE_URL } from "../utils/BASE_URL";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/register`, {
                username, email, password
            })

            const data = res.data;
            console.log("Data from register:", data);

            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            const backendMessage =
                error?.response?.data?.message ||   // most backends return this
                error?.response?.data?.error ||     // fallback
                error?.message ||
                "Something went wrong";
            console.log("Error during registration:", backendMessage);
            return { success: false, error: backendMessage };
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const res = await axios.post(`${BASE_URL}/api/auth/login`, {
                email, password
            })

            const data = res.data;
            console.log("Data from login:", data);

            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            const backendMessage =
                error?.response?.data?.message ||   // most backends return this
                error?.response?.data?.error ||     // fallback
                error?.message ||
                "Something went wrong";
            console.log("Error during login:", backendMessage);
            return { success: false, error: backendMessage };
        }
    },
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            console.log("Auth checked. User:", user, "Token:", token);
            set({ user, token });
        } catch (error) {
            console.log("Auth checking auth:", error);
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            set({ user: null, token: null });
        } catch (error) {
            console.log("Error during logout:", error);
        }
    },


}))