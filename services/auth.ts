import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
//import "dotenv/config";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (data?.session) {
    return data.session.access_token; // This is the JWT token
  }
  return null;
}

export async function getUUID() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    return user?.id;
  }
  return null;
}
