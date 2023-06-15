import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Provider as PaperProvider,
  Appbar,
  IconButton
} from 'react-native-paper';

import Home from "./Home";
import Settings from "./Settings";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import customTheme from '../buzzTheme';
import { StackActions } from '@react-navigation/routers';
const Tab = createBottomTabNavigator();

function Tabs({ navigation }: { navigation: any }) {
  return (
    <PaperProvider>
      <Appbar style={styles.appBar}>

        <Appbar.Content color={customTheme.colors.primary} title="Buzz" />

        {/* TODO: BLE sync feature coming in next release  */}
        {/* <Icon color={customTheme.colors.primary} name="logout" size={24} style={styles.appBarIcon} /> */}
        <IconButton iconColor={customTheme.colors.primary} icon="logout" size={24} onPress={() => {
          navigation.dispatch(StackActions.popToTop())
        }} />

      </Appbar>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: customTheme.colors.inversePrimary,
          tabBarInactiveTintColor: customTheme.colors.primary,
          headerShown: false,
        }}
      >
        {/* Change tab label color */}
        <Tab.Screen options={{ tabBarIcon: () => <Icon name='home' style={styles.tabIcon} /> }} name="Home" component={Home} />
        <Tab.Screen options={{ tabBarIcon: () => <Icon name='account-settings' style={styles.tabIcon} /> }} name="Settings" component={Settings} />
      </Tab.Navigator>
    </PaperProvider>

  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 24,
    color: customTheme.colors.primary
  },
  appBar: {
    flexDirection: 'row',
    backgroundColor: '#F2CD5D',
},
});

export default Tabs;