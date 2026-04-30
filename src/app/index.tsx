import { Redirect } from "expo-router";

export default function Index() {
  const user = false;

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
