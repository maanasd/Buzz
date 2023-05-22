/**
 * Buzz Password Manager
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Home from './components/Home';
import Login from './components/Login';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
type StackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();
const DEBUG_MODE = true; // set this flag for debugging purposes
function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen options={{headerShown: DEBUG_MODE}} name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;
