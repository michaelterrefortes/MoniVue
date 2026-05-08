import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { url } from "../../../constants/url";
import { getAccessToken, supabase } from "../../../services/auth";

const Account = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  const [loadingSignout, setLoadingSignout] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    setLoadingSignout(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      Alert.alert("Error", "Problem signing out");
    } finally {
      setLoadingSignout(false);
    }
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
    setLoadingDelete(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${url}/profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      setLoadingDelete(false);

      if (!res.ok) Alert.alert("Error", result.error);
      else handleSignOut();
    } catch (err) {
      Alert.alert("Error", "Could not delete account");
      console.error(err);
      setLoadingDelete(false);
    }
  };

  const handleLink = useCallback(async () => {
    // Check if the link is supported
    const linkUrl = `${url}/privacy-policy`;
    const supported = await Linking.canOpenURL(linkUrl);

    if (supported) {
      // Open the URL
      await Linking.openURL(linkUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${linkUrl}`);
    }
  }, []);

  const handleEmail = async () => {
    // Check if the link is supported
    const email = "monivue.support@gmail.com";
    const subject = "Contact Us";
    const body = "Hello Support team,";

    // Construct the mailto link
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      // Check if the device can handle the email URL
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          `No email app found to handle this request. The email for support is: ${email}`,
        );
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <ScrollView>
      <View style={{ height: 200 }} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonTextRegular}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLink}>
          <Text style={styles.buttonTextRegular}>Privacy Policy</Text>
        </TouchableOpacity>

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

        {loadingSignout ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              //marginTop: 10,
              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 5 }}>Processing request ...</Text>
            <ActivityIndicator size={20} color="gray" />
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={confirmDelete}>
          <Text style={styles.buttonText}>Delete Account and Data</Text>
        </TouchableOpacity>

        {loadingDelete ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              //marginTop: 10,
              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 5 }}>Processing addition ...</Text>
            <ActivityIndicator size={20} color="gray" />
          </View>
        ) : null}
      </View>
    </ScrollView>
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
