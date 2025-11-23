import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { useAuthStore } from "../store/authStore";
import styles from "../assets/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/Colors";

export default function LogoutButton() {
  const { logout } = useAuthStore();

  const confirmLogout = () => {
    if (Platform.OS === 'web') {
      // Use browser's native confirm dialog on web
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        logout();
      }
    } else {
      // Use React Native Alert on mobile
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Logout", onPress: () => logout(), style: "destructive" },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}