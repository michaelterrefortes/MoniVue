import { Stack } from "expo-router";
import AccountButton from "../../../../components/AccountButton";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackTitle: "",

          headerShown: true,

          //headerLargeTitle: true,
          headerLargeTitleEnabled: true,
          headerTitle: "Spending",
          //headerRight: () => <AccountButton />,
          unstable_headerRightItems: () => [
            {
              type: "custom",
              element: <AccountButton />,
            },
          ],
        }}
      />
    </Stack>
  );
};

export default Layout;
