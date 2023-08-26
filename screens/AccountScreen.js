import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = ({navigtion}) => {
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState(null);
  useEffect(() => {
    const downloadData = async () => {
      try {
        const response = await fetch("http://192.168.43.16:3000/account");
        const apiData = await response.json();
        setData(apiData);
      } catch (error) {
        console.log(error);
      }
    };
    downloadData();
  }, []);

  useEffect(() => {
    const getUserID = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');
        setUserID(userID);
      } catch (error) {
        console.log(error);
      }
    };

    getUserID();
  }, []);

  const account = data.find((item) => item.id == userID);
  const accountAvatar = account ? account.avatar : null;

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.info}>
          <Image
            style={{ marginTop: 10, width: 150, height: 150, borderColor: 'white', borderWidth: 3, borderRadius: 100 }}
            source={{uri: accountAvatar}}
          />
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 5, marginTop: 10 }}>
            {account?.hoTen}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#4d97f3', padding: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 20 }}
          >
            <Image
              style={{ width: 25, height: 25, borderColor: 'white', borderWidth: 3, borderRadius: 100 }}
              source={require('../assets/icons/add.png')}
            />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginStart: 5 }}>Theo dõi</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.textBV}>Bài viết</Text>
        
      </SafeAreaView>
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:20,
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  info: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 10,
    marginBottom: 5,
  },
  textBV: {
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 1,
  },
});
