import { SafeAreaView, StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ListScreen from './ListScreen';
import UserScreen from './UserScreen';

const Tab = createMaterialTopTabNavigator(); 
const HomeScreen = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection:'row',marginTop:28,alignItems:'center',justifyContent:'space-between'}}>
      <Text style={{fontSize:26,marginStart:10,color:'#57abff',fontWeight:'bold'}}>devtales</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Notification')} style={{borderRadius:20,backgroundColor:'#DCDCDC',width:35,height:35,alignItems:'center',justifyContent:'center',marginEnd:10}}>
      <Image style={{ width: 25, height: 25}} source={require('../assets/icons/notification.png')} />
      </TouchableOpacity>
      </View>
 <Tab.Navigator initialRouteName='Bài viết'>
    <Tab.Screen name="Bài viết" component={ListScreen} />
    <Tab.Screen name="Tài khoản" component={UserScreen} />
  </Tab.Navigator>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'white'
    }
})