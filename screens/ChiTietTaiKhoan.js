import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity,FlatList,Modal,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChiTietTaiKhoan = ({navigtion,route}) => {
  const {duLieu} = route.params;
  const [userID, setUserID] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  const [binhLuan, setbinhLuan] = useState("")
  const [hienBinhLuan, setHienBinhLuan] = useState(false)
  const [data, setData] = useState([]);
  const [dataBL, setDataBL] = useState([]);
  const [dataAC, setDataAC] = useState([]);
  const [dataBV, setDataBV] = useState([]);
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

  const postData = async (idBV) => {
      console.log(idBV)
      try {
          const response = await fetch("http://192.168.43.16:3000/binhLuan", {
              method: 'POST',
              headers: { "Content-Type": "application/json", },
              body: JSON.stringify({ noidung: binhLuan, idNguoiBL: userID, idBaiViet: idBV }),
          });
          if (response.ok) {
              console.log("Gửi thành công!");
              downloadDataBL(idBV);
          } else {
              console.log("Gủi thất bại");
          }
      } catch (error) {
          console.log(error);
      }
  }
  const images = [
      require('../assets/icons/like.png'),
      require('../assets/icons/likeroi.png'),
  ];
  const [imageIndex, setImageIndex] = useState(0);

  const handleLikePress = () => {
      const newIndex = (imageIndex + 1) % images.length;
      setImageIndex(newIndex);
  };

  const calculateTimeDifference = (time) => {

      const currentTime = new Date();
      const postTime = new Date(time);
      const timeDifference = currentTime - postTime;
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
          return `${days} ngày trước`;
      } else if (hours > 0) {
          return `${hours} giờ trước`;
      } else if (minutes > 0) {
          return `${minutes} phút trước`;
      } else {
          return `${seconds} giây trước`;
      }
  };
  useEffect(() => {
      downloadDataBV(duLieu);
  }, []);
  useEffect(() => {
      const downloadDataAC = async () => {
          try {
              const response = await fetch("http://192.168.43.16:3000/account");
              const apiData = await response.json();
              setDataAC(apiData);
          } catch (error) {
              console.log(error);
          }
      };

      downloadDataAC();
  }, []);
  const downloadDataBL = async (id) => {
      try {
          const response = await fetch("http://192.168.43.16:3000/binhLuan");
          const apiData = await response.json();
          
          const filteredData = apiData.filter(item => item.idBaiViet === id);
          setDataBL(filteredData);
      } catch (error) {
          console.log(error);
      }
  };
  

  const downloadDataBV = async (idAccount) => {
    try {
      const response = await fetch(`http://192.168.43.16:3000/news?idAccount=${idAccount}`);
      const apiData = await response.json();
      setDataBV(apiData);
    } catch (error) {
      console.log(error);
    }
  };
  const itemBL = ({ item }) => {
      const findAccountById = () => {
          const account = dataAC.find((ite) => ite.id.toString() === item.idNguoiBL);
          return account ? account : null;
      };
      const account = findAccountById();
      if (!account) {
          return null;
      }
      const { hoTen, avatar } = account;
      return (
        <View style={{backgroundColor:'white',flexDirection:'row',flex:1,margin:10}}>
                      <Image style={{ width: 50, height: 50 }} source={{ uri: avatar }} />
                      <View style={{backgroundColor:'#F5F5F5',marginStart:5,paddingVertical:5,paddingHorizontal:10,borderRadius:10,flex:1}}>
                          <Text style={{fontWeight:'bold',fontSize:16}}>{hoTen}</Text>
                          <Text style={{fontSize:14,marginTop:5}}>{item.noidung}</Text>
                      </View>
        </View>
      );
    };
    const hanldeBinhLuan=(id)=>{
      setDataBL([]);
  setHienBinhLuan(!hienBinhLuan);
  // Tải lại dữ liệu bình luận
  downloadDataBL(id);
    }
    const handleThoatBL=()=>{
      setDataBL([]);
      setHienBinhLuan(!hienBinhLuan)
    }
    const chuyen=()=>{
     
    }
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
  const account = data.find((item) => item.id == duLieu);
  const accountAvatar = account ? account.avatar : null;
  const baiViet = ({ item }) => {
    const idd = item.id;
    const timeDifference = calculateTimeDifference(item.thoiGian);
    const findAccountById = () => {
        const account = dataAC.find((ite) => ite.id.toString() === item.idAccount);
        return account ? account : null;
    };
    const account = findAccountById();
    if (!account) {
        return null;
    }

    const { hoTen, avatar } = account;
    return (
        <View style={styles.baiViet}>
            <View style={styles.nguoiDangBai}>
                <TouchableOpacity onPress={()=> navigation.navigate('ChitietAcc',{duLieu:item.idAccount.toString()})} style={{ flexDirection: 'row' }}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: avatar }} />
                    <View style={styles.nameNDB}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{hoTen}</Text>
                        <Text>{timeDifference}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ height: 20 }}>
                    <Image style={{ width: 40, height: 20, alignItems: 'flex-start' }} source={require('../assets/icons/more.png')} />
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16, paddingHorizontal: 10, marginBottom: 5 }}>{item.noidung}</Text>
            <Image style={{ width:"100%", height: 300, marginBottom: 10, resizeMode: "cover" }} source={{ uri: item.anh }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20, marginEnd: 5, }} source={require('../assets/icons/likes.png')} />
                    <Text >123</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginEnd: 5 }}>123</Text>
                    <Text>bình luận</Text>
                </View>
            </View>
            <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center', marginBottom: 10 }} />
            <View style={styles.tuongTac}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={()=>handleLikePress()}>
                    <Image style={{ width: 25, height: 25, marginEnd: 10, }} source={images[imageIndex]} />
                    <Text >Thích</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>hanldeBinhLuan(item.id)} style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ width: 25, height: 25, marginEnd: 10, }} source={require('../assets/icons/comment.png')} />
                    <Text >Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ width: 25, height: 25, marginEnd: 10, }} source={require('../assets/icons/share.png')} />
                    <Text >Chia sẻ</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType="slide" transparent={true} visible={hienBinhLuan}>
                <View style={styles.DialogBL}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 25, marginStart: 20 }}>Bình luận</Text>
                        <TouchableOpacity onPress={() => handleThoatBL()} style={{ marginStart: 180 }}>
                            <Image style={{ width: 40, height: 40, marginEnd: 10, }} source={require('../assets/icons/thoat.png')} />
                        </TouchableOpacity>
                    </View>
                    <FlatList style={{ width: '100%' }}
                        data={dataBL}
                        renderItem={itemBL}
                        keyExtractor={(it) => it.id.toString()}
                    />
                    <View style={styles.textAreaContainer} >
                        <TextInput
                            placeholder='Nhập nội dung tại đây!'
                            style={styles.textArea}
                            multiline={true}
                            onChangeText={(text) => setbinhLuan(text)}
                        />
                        <TouchableOpacity onPress={() => postData(idd)} style={{ width: "10%", height: 35 }}>
                            <Image style={{ width: "100%", height: 35 }} source={require('../assets/icons/send.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
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
          <TouchableOpacity onPress={()=>handleFollow}
            style={{ backgroundColor: '#4d97f3', padding: 5, flexDirection: 'row', alignItems: 'center', borderRadius: 20 }}
          >
            <Image
              style={{ width: 25, height: 25, borderColor: 'white', borderWidth: 3, borderRadius: 100 }}
              source={require('../assets/icons/add.png')}
            />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginStart: 5 }}>{isFollowing ? 'Đã theo dõi' : 'Chưa theo dõi'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.textBV}>Bài viết</Text>
        <FlatList style={{ width: '100%' }}
                data={dataBV}
                renderItem={baiViet}
                keyExtractor={(item) => item.id.toString()}
            />
      </SafeAreaView>
    </ScrollView>
  );
};

export default ChiTietTaiKhoan;

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
  }, DialogBL: {
    marginTop: 50,
    width: "90%",
    height: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
btnThemBaiViet: {
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 5,
},
textAreaContainer: {
    width: "100%",
    marginVertical: 5,
    padding: 10,
    flexDirection: 'row',
},
textArea: {
    width: "90%",
    fontSize: 18,
},
textTBV: {
    fontSize: 17,
    padding: 10,
    borderWidth: 1,
    textAlign: 'left',
    flex: 1,
    borderRadius: 20,
    marginStart: 10,
}, baiViet: {
    backgroundColor: 'white',
    width: '100%',
    paddingBottom: 10,
    marginBottom: 10,
    alignSelf: 'center'
},
nguoiDangBai: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
},
nameNDB: {
    marginStart: 10,
},
tuongTac: {
    height: 30,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30
}
});
