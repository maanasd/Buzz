/**
 * Buzz Password Manager
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import HomeTabs from './components/HomeTabs';
import Login from './components/Login';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type StackParamList = {
  Login: undefined;
  HomeTabs: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const DEBUG_MODE = false; // set this flag for debugging purposes
function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{title:"Access"}}  name="Login" component={Login} />
        <Stack.Screen options={{headerShown: DEBUG_MODE}} name="HomeTabs" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;
