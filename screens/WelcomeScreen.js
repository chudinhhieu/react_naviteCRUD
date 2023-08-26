import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login'); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={require('../assets/images/logo.png')} />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
