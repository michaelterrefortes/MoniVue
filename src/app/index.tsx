import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../services/auth";

export default function Index() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      // Fake delay so splash is visible
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)");
      }

      setLoading(false);
    };

    initialize();
  }, []);

  // Splash Screen
  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/icon-monivue.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>MoniVue</Text>

        <Text style={styles.subtitle}>Budget Manager App</Text>

        <ActivityIndicator
          size="large"
          color="gray"
          style={{ marginTop: 30 }}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 16,

    marginTop: 10,
  },
});
