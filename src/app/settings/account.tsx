import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { url } from "../../../constants/url";
import { getAccessToken, supabase } from "../../../services/auth";

const Account = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)");
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete this account? This action is irreversible and data is deleted",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  const handleDelete = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${url}/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      handleSignOut();
    } catch (err) {
      Alert.alert("Error", "Could not delete account");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email ?? "Loading..."}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/settings/change-income")}
      >
        <Text style={styles.buttonTextRegular}>Change Monthly Income</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/settings/change-email")}
      >
        <Text style={styles.buttonTextRegular}>Change Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/settings/change-password")}
      >
        <Text style={styles.buttonTextRegular}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={confirmDelete}>
        <Text style={styles.buttonText}>Delete Account and Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(242, 242, 242)",
  },

  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    width: "70%",
    alignSelf: "center",
    marginBottom: 15, // ⬅️ spacing between items
  },

  label: {
    fontSize: 12,
    color: "gray",
  },

  value: {
    fontSize: 14,
    color: "#000",
    marginTop: 4,
  },

  input: {
    fontSize: 14,
  },

  buttonText: {
    fontSize: 14,
    color: "red",
    textAlign: "left",
  },

  buttonTextRegular: {
    fontSize: 14,
    color: "blue",
    textAlign: "left",
  },
});
