import { StyleSheet, Text, View, Image, TouchableOpacity,TextInput, ScrollView  } from 'react-native'
import React,{useState,useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
const CreatePostScreen = ({ route,navigation }) => {
  
  const [image, setImage] = useState(null);
  const [noidung, setNoidung] = useState("");
  const [thoiGian, setThoigian] = useState("");
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState(null);
    const currentTime = new Date();
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const imageResult = await ImagePicker.launchImageLibraryAsync();
  
    if (!imageResult.canceled) {
      const selectedImage = imageResult.assets[0];
      setImage(selectedImage.uri);
    }
  };

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

  const postData = async () => {
    try {
      const response = await fetch("http://192.168.43.16:3000/news", {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({noidung: noidung,anh:image,idAccount: userID,thoiGian:currentTime}),
      });
      if (response.ok) {
        console.log("Gửi thành công!");
        route.params.taiBaiVietAdmin(userID);
        navigation.goBack();
      } else {
        console.log("Gủi thất bại");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ScrollView>
    <View style={styles.nguoiDangBai}>
      <View style={{flexDirection:'row',alignItems:'center',height:55,marginTop:20,borderBottomWidth:0.15,borderColor:'gray'}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image  style={{width:35,height:35,marginEnd:20,marginStart:10}} source={require('../assets/icons/back.png')}/>
        </TouchableOpacity>
        <Text style={{fontSize:20}}>Tạo bài viết</Text>
        <TouchableOpacity onPress={postData} style={{backgroundColor:'#57abff',width:100,height:40,borderRadius:10,justifyContent:'center',alignItems:'center',marginStart:125}}>
        <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Đăng</Text>
        </TouchableOpacity> 
      </View>
      <View style={{ flexDirection: 'row',width:'100%',padding:10 }}>
        <Image style={{ width: 50, height: 50 }} source={{uri:account?.avatar}} />
        <View style={styles.nameNDB}>
          <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{account?.hoTen}</Text>
        </View>
       <TouchableOpacity onPress={selectImage} style={{marginStart:100,flexDirection:'row',borderColor:"#57abff",borderWidth:2,alignItems:'center',paddingHorizontal:5,borderRadius:10}}>
        <Image style={{width:30,height:30}} source={require('../assets/icons/thuvien.png')}/>
        <Text style={{color:'#57abff',fontWeight:'bold'}}>Thêm ảnh</Text>
       </TouchableOpacity>
      </View>
      <View style={styles.textAreaContainer} >
        <TextInput 
          placeholder='Nhập nội dung tại đây!'
          style={styles.textArea}
          multiline={true}
          onChangeText={(text)=>setNoidung(text)}
        />
      </View>
      <Image source={{ 
        uri: image 
      }} 
        style={styles.image} />
    </View>
    </ScrollView>
  )
}

export default CreatePostScreen

const styles = StyleSheet.create({
  nguoiDangBai: {
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor:'white',
  },
  image: {
    alignSelf:'center',
    width: '97%',
    height: 350,
    marginTop: 16,
    resizeMode: 'cover',
  },
  nameNDB: {
    marginStart: 10,
  }, 
  textAreaContainer: {
    marginVertical:10,
    padding: 10,
  },
  textArea: {
    fontSize: 18,
    }
})