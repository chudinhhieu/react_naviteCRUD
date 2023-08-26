import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { flushAsync } from 'expo-facebook';
import { TextInput } from "@react-native-material/core";

const UserScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [userID, setUserID] = useState(null);
  const [mkCu, setMkCu] = useState('')
  const [mkMoi, setmkMoi] = useState('')
  const [laimkMoi, setlaimkMoi] = useState('')
  const [hoTenDoi, sethoTenDoi] = useState('')
  const [emailDoi, setemailDoi] = useState('')
  const [ngaysinhDoi, setngaysinhDoi] = useState('')
  const [hienDMK, sethienDoiMK] = useState(false)
  const [hienDoiTT, sethienDoiTT] = useState(false)
  const [hienXacNhanQuyen, sethienXacNhanQuyen] = useState(false)
  const [hienDoiQuyen, sethienDoiQuyen] = useState(false)
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

  // Check quyền
  const [isAdmin, setisAdmin] = useState(false);
  useEffect(() => {
    if (account?.taiKhoan == "admin") {
      setisAdmin(true);
    } else {
      setisAdmin(false);
    }
  }, [account]);
  const checkDMK=(object)=>{
    if(mkCu==""||mkMoi==""||laimkMoi==""){
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ mật khẩu!');
      return;
    Ư
    updateById(object);
    sethienDoiMK(!hienDMK)}
  }
  const updateById = async (object) => {
    try {
      const response = await fetch(`http://192.168.43.16:3000/account/${object.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: object.avatar,
          hoTen: object.hoten,
          id:object.id,
          email: object.email,
          ngaySinh: object.ngaySinh,
          matKhau: object.matKhau,
          quyen:object.quyen,
        }),
      });

      if (response.ok) {
        console.log("update successful");
        account = data.find((item) => item.id == userID);
      } else {
        console.log("update not successful");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [object, setObject] = useState({
    id: "",
    avatar: "",
    taiKhoan: "",
    hoten: "",
    email: "",
    ngaySinh: "",
    matKhau: "",
    quyen:"0",
  });
  const textQuyen =(quyen)=>{
    return quyen=="0"?"Người dùng":"Admin"
  }
  const NguoiDung = ({ item }) => {
    return (
        <View style={{ backgroundColor: 'white', flexDirection: 'row', width:'100%', margin: 10 }}>
            <Image style={{ width: "13%", height: 50 }} source={{ uri: item?.avatar }} />
            <View style={{width:'50%', backgroundColor: '#F5F5F5', marginStart: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10}}>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{item?.hoTen}</Text>
                <Text style={{fontSize: 15 }}>{textQuyen(item?.quyen)}</Text>
            </View>
            <TouchableOpacity onPress={()=>{console.log(item);setObject(item);console.log(object); sethienXacNhanQuyen(!hienXacNhanQuyen);console.log("cu"+object.quyen); setObject({ ...object,quyen:object.quyen==0?1:0});}} style={{height:50,alignItems:'center',justifyContent:'center',width:'27%',marginStart:10,alignSelf:'center',backgroundColor:'#4d97f3',marginEnd:10}}>
              <Text style={{color:'white',fontWeight:'bold',fontSize:15}}>Đổi quyền</Text>
            </TouchableOpacity>
            <Modal animationType='fade' transparent={true} visible={hienXacNhanQuyen} >
                        <View style={styles.menuXoa}>
                            <Text style={{ fontSize: 18,textAlign:'center', fontWeight: 'bold', margin: 10, alignSelf: 'center' }}>{`Bạn muốn đổi quyền từ ${object.quyen==0?"Người dùng":"Admin"} sang ${object.quyen==0?"Admin":"Người dùng"}`}</Text>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() =>  {updateById(object);sethienXacNhanQuyen(!hienXacNhanQuyen)}} style={{ borderRadius: 10, backgroundColor: '#4d97f3', width: '40%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Đồng ý</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => sethienXacNhanQuyen(!hienXacNhanQuyen)} style={{ borderRadius: 10, borderColor: '#4d97f3', borderWidth: 1, width: '40%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#4d97f3', fontSize: 15, fontWeight: 'bold' }}>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

        </View>
    );
};
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.info}>
          <Image
            style={{ marginTop: 10, width: 150, height: 150, borderColor: 'white', borderWidth: 3, borderRadius: 100 }}
            source={{ uri: account?.avatar }}
          />
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 10 }}>
            {account?.hoTen}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'white', paddingVertical: 5 }}>
          <Image style={{ width: 40, height: 40, marginEnd: 20 }} source={require('../assets/icons/mail.png')} />
          <Text style={{ fontSize: 16 }}>{`Email: ${account?.email}`}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginVertical: 2, backgroundColor: 'white', paddingVertical: 5 }}>
          <Image style={{ width: 40, height: 40, marginEnd: 20 }} source={require('../assets/icons/calendar.png')} />
          <Text style={{ fontSize: 16 }}>{`Ngày sinh: ${account?.ngaySinh}`}</Text>
        </View>
        <View style={{ backgroundColor: 'white', width: '100%', alignItems: 'center', paddingVertical: 110 }}>
          <TouchableOpacity onPress={() => sethienDoiTT(!hienDoiTT)} style={{ borderRadius: 10, width: '50%', backgroundColor: '#57abff', marginTop: 5, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Đổi thông tin</Text>
          </TouchableOpacity>
          {isAdmin && (
            <TouchableOpacity onPress={()=>sethienDoiQuyen(!hienDoiQuyen)} style={{ borderWidth: 2, borderColor: '#4d97f3', borderRadius: 10, width: '50%', backgroundColor: 'white', marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4d97f3' }}>Quản lý người dùng</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => {sethienDoiMK(!hienDMK);setObject(account)}} style={{ borderRadius: 10, width: '50%', backgroundColor: '#57abff', marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ borderWidth: 2, borderColor: '#4d97f3', borderRadius: 10, width: '50%', backgroundColor: 'white', marginTop: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4d97f3' }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="fade" transparent={true} visible={hienDMK}>
          <View style={styles.viewDMK}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 25, marginStart: 20 }}>Đổi mật khẩu</Text>
              <TouchableOpacity onPress={() => sethienDoiMK(!hienDMK)} style={{ marginStart: 130 }}>
                <Image style={{ width: 40, height: 40, marginEnd: 10, }} source={require('../assets/icons/thoat.png')} />
              </TouchableOpacity>
            </View>
            <TextInput
              secureTextEntry
              variant='outlined'
              label='Mật khẩu cũ'
              style={styles.input}
              value={mkCu}
              onChangeText={(text) => setMkCu(text)}
            />
            <TextInput
              secureTextEntry
              variant='outlined'
              label='Mật khẩu mới'
              style={styles.input}
              value={mkMoi}
              onChangeText={(text) => { setObject({ ...object, matKhau: text }); setmkMoi(text) }}
            />
            <TextInput
              secureTextEntry
              variant='outlined'
              label='Mật khẩu mới lần nữa'
              style={styles.input}
              value={laimkMoi}
              onChangeText={(text) => setlaimkMoi(text)}
            />
            <TouchableOpacity onPress={() => checkDMK(object)} style={{ marginTop: 30, width: '80%', borderWidth: 2, borderColor: '#4d97f3', borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingVertical: 9, alignSelf: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4d97f3' }}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={hienDoiTT}>
          <View style={styles.viewDMK}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 25, marginStart: 20 }}>Đổi thông tin</Text>
              <TouchableOpacity onPress={() => sethienDoiTT(!hienDoiTT)} style={{ marginStart: 130 }}>
                <Image style={{ width: 40, height: 40, marginEnd: 10, }} source={require('../assets/icons/thoat.png')} />
              </TouchableOpacity>
            </View>
            <TextInput
              variant='outlined'
              label='Họ và tên'
              style={styles.input}
              value={hoTenDoi}
              onChangeText={(text) => { sethoTenDoi(text) }}
            />
            <TextInput
              variant='outlined'
              inputMode='email'
              label='Email'
              style={styles.input}
              value={emailDoi}
              onChangeText={(text) => setemailDoi(text)}
            />
            <TextInput
              variant='outlined'
              label='Ngày sinh'
              style={styles.input}
              value={ngaysinhDoi}
              onChangeText={(text) => setngaysinhDoi(text)}
            />
            <TouchableOpacity onPress={() => sethienDoiTT(!hienDoiTT)} style={{ marginTop: 30, width: '80%', borderWidth: 2, borderColor: '#4d97f3', borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingVertical: 9, alignSelf: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4d97f3' }}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={hienDoiQuyen}>
          <View style={styles.viewUser}>
            <Text style={{alignSelf:'center',paddingVertical:10,fontWeight:"bold",color:'#4d97f3',fontSize:22}}>Danh sách người dùng</Text>
            <FlatList style={{ width: '100%' }}
                data={data}
                renderItem={NguoiDung}
                keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity onPress={() => sethienDoiQuyen(!hienDoiQuyen)} style={{ marginBottom:20, marginTop: 30, width: '80%', borderWidth: 2, borderColor: '#4d97f3', borderRadius: 5, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', paddingVertical: 9, alignSelf: 'center' }}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: '#4d97f3' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
  },
  info: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingBottom: 10,
    marginBottom: 2,
  },
  viewDMK: {
    width: "90%",
    height: '45%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  viewUser: {
    width: "90%",
    height: '70%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    marginTop: 20,
    alignSelf: 'center'
  },
  menuXoa: {
    backgroundColor: '#F5F5F5', width: 320, paddingBottom: 15, alignSelf: 'center', marginTop: 300, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    borderRadius: 20,
},
});
