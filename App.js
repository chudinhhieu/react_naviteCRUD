import { StyleSheet} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './screens/WelcomeScreen'
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import NotificationScreen from './screens/NotificationScreen';
import AccountScreen from './screens/AccountScreen';
import ChiTietTaiKhoan from './screens/ChiTietTaiKhoan';
import ListScreen from './screens/ListScreen';
import UserScreen from './screens/UserScreen';


const App = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
  <Stack.Navigator initialRouteName='Welcome'>
      <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen}/>
      <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen}/>
      <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen}/>
      <Stack.Screen options={{headerShown: false}}name="SignUp" component={SignUpScreen}/>
      <Stack.Screen options={{headerShown:false}} name="Create" component={CreatePostScreen}/>
      <Stack.Screen options={{headerShown:false}} name="User" component={UserScreen}/>
      <Stack.Screen options={{title:'Thông báo'}} name="Notification" component={NotificationScreen}/>
      <Stack.Screen options={{headerShown:false}} name="ChitietAcc" component={ChiTietTaiKhoan}/>
      <Stack.Screen options={{headerShown:false}} name="List" component={ListScreen}/>
  </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App
const styles = StyleSheet.create({
})