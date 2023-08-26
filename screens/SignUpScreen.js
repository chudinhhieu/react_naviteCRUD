import { SafeAreaView, StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react'
import { TextInput } from "@react-native-material/core";
const SignUpScreen = (props) => {
  const { route,navigation } = props;
  const [avatar, setAvatar] = useState("file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FImage-fbde3edd-65d3-40f3-86df-b8fc0d1375d8/ImagePicker/d9290a87-5748-4460-ba63-2c13b9a5800a.png")
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [birthDay, setBirthday] = useState('');
  const [rePassword, setRepassword] = useState('');

  const postData = async () => {
    try {
      const response = await fetch("http://192.168.43.16:3000/account", {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ taiKhoan: username, hoTen: fullname, ngaySinh: birthDay,email:email,matKhau:password,avatar:avatar,quyen:0 }),
      });
      console.log(response);
      if (response.ok) {
        console.log("Gửi thành công!");
        navigation.goBack();
        route.params.downloadData();
      } else {
        console.log("Gủi thất bại");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
<Text style={{ fontSize: 30, color: '#57abff',fontWeight:'bold',fontStyle:'italic'}}>
  Chào mừng bạn đến với
</Text>
      <Text style={{marginBottom:20, fontSize: 40, color: '#57abff',fontWeight:'bold'}}>DevTales</Text>
    <TextInput
        color='#57abff'
        variant='outlined'
        label='Tài khoản'
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
    />
    <TextInput
        color='#57abff'
        variant='outlined'
        label='Họ và tên'
        style={styles.input}
        value={fullname}
        onChangeText={(text) => setFullname(text)}
    />
    <TextInput
        color='#57abff'
        variant='outlined'
        label='Ngày sinh'
        style={styles.input}
        value={birthDay}
        onChangeText={(text) => setBirthday(text)}
    />
    <TextInput
        color='#57abff'
        variant='outlined'
        label='Email'
        keyboardType='email-address'
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
    />
    <TextInput
        color='#57abff'
        secureTextEntry
        variant='outlined'
        label='Mật khẩu'
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
    />
   <TextInput
      color='#57abff'
        secureTextEntry
        variant='outlined'
        label='Nhập lại mật khẩu'
        style={styles.input}
        value={rePassword}
        onChangeText={(text) => setRepassword(text)}
    />
   <TouchableOpacity onPress={postData} style={styles.btnDK}>
                <Text style={styles.btnText}>Đăng ký</Text>
            </TouchableOpacity>
    </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFFF',
    alignItems: 'center',
    paddingTop:70,
},

input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    marginTop:20,
},
btnText: {
    fontWeight: 'bold',
    color: '#57abff',
    fontSize: 17
},
btnDK: {
  width: "80%",
  height: 50,
  borderRadius: 5,
  borderColor: '#57abff',
  borderWidth: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  marginTop:100
},
})