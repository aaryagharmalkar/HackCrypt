import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

export default function CustomDrawer(props: any) {
  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="shield-checkmark-outline" size={26} color="#fff" />
        </View>
        <Text style={styles.appName}>Proof of Luck</Text>
        <Text style={styles.tagline}>Financial Wellness</Text>
      </View>

      {/* 🔹 Drawer items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.menu}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* 🔻 Logout footer */}
      <TouchableOpacity
        onPress={async () => {
          await supabase.auth.signOut();
        }}
        style={styles.logout}
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Header */
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: "800",
  },
  tagline: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  /* Menu */
  menu: {
    paddingTop: 8,
  },

  /* Logout */
  logout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 15,
  },
});
