import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, SafeAreaView, Image, FlatList, Modal,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

const ListScreen = ({ navigation }) => {
    const [hienMenu, sethienMenu] = useState(false)
    const [hienMenuXoa, sethienMenuXoa] = useState(false)
    const [hienMenuSua, sethienMenuSua] = useState(false)
    const [hienBinhLuan, setHienBinhLuan] = useState(false)
    const [dataBL, setdataBL] = useState([])
    const [binhLuan, setbinhLuan] = useState('')
    const [idBVBL, setidBVBL] = useState('')
    const [soLuotBinhLuan, setSoLuotBinhLuan] = useState({});
    const [BaiViet, setBaiViet] = useState([])
    const [noiDungSua, setnoiDungSua] = useState('')
    const [anhSua, setanhSua] = useState(null);
    // Lấy dữ liệu tất cả tài khoản
    const [duLieuTK, setDuLieuTK] = useState([]);
    useEffect(() => {
        const taiDuLieuTK = async () => {
            try {
                const response = await fetch("http://192.168.43.16:3000/account");
                const apiData = await response.json();
                setDuLieuTK(apiData);
            } catch (error) {
                console.log(error);
            }
        };

        taiDuLieuTK();
    }, []);

    // Lấy ra id tài khoản đang đăng nhập
    const [idNguoiDung, setIdNguoiDung] = useState(null);
    useEffect(() => {
        const layIdNguoiDung = async () => {
            try {
                const idNguoidung = await AsyncStorage.getItem('userID');
                setIdNguoiDung(idNguoidung);
            } catch (error) {
                console.log(error);
            }
        };

        layIdNguoiDung();
    }, []);

    // Lấy ra tài khoản theo id
    const tk = duLieuTK.find((item) => item.id == idNguoiDung);

    const share = async(uri, message) => {
        const result = await Sharing.shareAsync(uri, { mimeType: 'image/jpeg', dialogTitle: 'Share this image', message });
        if (result.action === Sharing.sharedAction) {
          if (result.activityType) {
            console.log(`Shared via ${result.activityType}`);
          } else {
            console.log('Shared');
          }
        } else if (result.action === Sharing.dismissedAction) {
          console.log('Dismissed');
        }
      }
      
    const [baiVietSua, setbaiVietSua] = useState({
        id: "",
        anh: "",
        noidung: "",
        thoiGian: "",
        idAccount:"",
      });
    //Tính thời gian bài đã được đăng
    const thoiGianChenhLech = (time) => {

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
    
    // Check quyền
    const [isAdmin, setisAdmin] = useState(false);
    useEffect(() => {
        if (tk?.quyen=="1") {
            setisAdmin(true);
        } else {
            setisAdmin(false);
        }
        if (tk?.quyen=="1") {
            setisAdmin(true);
        } else {
            setisAdmin(false);
        }
    }, [tk]);
    useEffect(() => {
        if (isAdmin) {
            taiBaiVietAdmin(tk.id);
        } else {
            taiTatCaBaiViet();
        }
        if (isAdmin) {
            taiBaiVietAdmin(tk.id);
        } else {
            taiTatCaBaiViet();
        }
    },[isAdmin]);
    //Lấy dữ liệu bài viết
    const [duLieuBaiViet, setduLieuBaiViet] = useState([])

    const taiBaiVietAdmin = async (idNguoiDung) => {
        try {
            const response = await fetch(`http://192.168.43.16:3000/news?idAccount=${idNguoiDung}`);
            const apiData = await response.json();
            setduLieuBaiViet(apiData);
        } catch (error) {
            console.log(error);
        }
    };
    const taiTatCaBaiViet = async () => {
        try {
            const response = await fetch("http://192.168.43.16:3000/news");
            const apiData = await response.json();
            setduLieuBaiViet(apiData);
        } catch (error) {
            console.log(error);
        }
    };
    
    //Xóa bài viết theo id 
    const deleteById = async (id) => {
        try {
            const response = await fetch(`http://192.168.43.16:3000/news/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                sethienMenuXoa(!hienMenuXoa);
                taiBaiVietAdmin(idNguoiDung);
                console.log('Deleted successfully');
            } else {
                console.log('Error');
            }


        } catch (error) {
            console.log(error);
        }
    };
    const clickXoa = () => {
        sethienMenuXoa(!hienMenuXoa);
        sethienMenu(!hienMenu);
    }
    //Chọn ảnh sửa 
    const chonAnh = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
      
        const imageResult = await ImagePicker.launchImageLibraryAsync();
      
        if (!imageResult.canceled) {
          const selectedImage = imageResult.assets[0];
          setanhSua(selectedImage.uri);
          setbaiVietSua({ ...baiVietSua, anh: selectedImage.uri })
        }
      };
    //Cập nhật bài viết theo id
    const updateById = async (baiVietSua) => {
        try {
          const response = await fetch(`http://192.168.43.16:3000/news/${baiVietSua.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              anh: baiVietSua.anh,
              noidung: baiVietSua.noidung,
            }),
          });
    
          if (response.ok) {
            console.log("update successful");
            taiBaiVietAdmin(idNguoiDung);
            sethienMenuSua(!hienMenuSua);
          } else {
            console.log("update not successful");
          }
        } catch (error) {
          console.log(error);
        }
      };
    //Click vào nút like
    const [liked, setLiked] = useState(false);
    const images = [
        require('../assets/icons/like.png'),
        require('../assets/icons/likeroi.png'),
    ];

    const handleLikePress = (id) => {
        postLike(id, idNguoiDung);
      };
    //Post like
    const deleteLike = async (likeId) => {
        try {
            const response = await fetch(`http://192.168.43.16:3000/like/${likeId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                console.log("Xóa thành công!");
            } else {
                console.log("Xóa thất bại");
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    
    const postLike = async (idBaiViet,idNguoiDang) => {
        try {
            const response = await fetch(`http://192.168.43.16:3000/like?idNguoiDang=${idNguoiDang}&idBaiViet=${idBaiViet}`);
            const data = await response.json();
            if (data.length > 0) {
                // Đã tồn tại, xóa đối tượng
                const likeId = data[0].id; // Giả sử id của like là trường "id"
                await deleteLike(likeId);
                setLiked(!liked);
            } else {
                // Chưa tồn tại, thêm đối tượng
                const postResponse = await fetch("http://192.168.43.16:3000/like", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({idBaiViet,idNguoiDang}),
                });
                if (postResponse.ok) {
                    console.log("Gửi thành công!");
                setLiked(!liked);
                } else {
                    console.log("Gửi thất bại");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    
    //Click vào bình luận
    const  downloadDataBL = async (id) => {
        try {
            const response = await fetch("http://192.168.43.16:3000/binhLuan");
            const apiData = await response.json();
            const filteredData = apiData.filter(item => item.idBaiViet === id);
            setdataBL(filteredData);
        } catch (error) {
            console.log(error);
        }
    };
    //post Bình luận
    const postBinhLuan = async () => {
        try {
            const response = await fetch("http://192.168.43.16:3000/binhLuan", {
                method: 'POST',
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ noidung: binhLuan, idNguoiBL: idNguoiDung, idBaiViet: idBVBL}),
            });
            if (response.ok) {
                console.log("Gửi thành công!");
                downloadDataBL(idBVBL);
                laySoLuotBinhLuan(idBVBL)
                setHienBinhLuan(!hienBinhLuan);
            } else {
                console.log("Gủi thất bại");
            }
        } catch (error) {
            console.log(error);
        }
    }
    //Lấy ra số lượt bình luận của mỗi bài viết
    const laySoLuotBinhLuan = async (idBaiViet) => {
        try {
          const response = await fetch(
            `http://192.168.43.16:3000/binhLuan?idBaiViet=${idBaiViet}`
          );
          const apiData = await response.json();
          const soLuong = apiData.length;
          setSoLuotBinhLuan((prevState) => ({
            ...prevState,
            [idBaiViet]: soLuong,
          }));
        } catch (error) {
          console.log(error);
        }
      };
      useEffect(() => {
          duLieuBaiViet.forEach((item) => {
            laySoLuotBinhLuan(item.id);
          });
      }, [duLieuBaiViet]);
    //item Bình luận
    const itemBinhLuan = ({ item }) => {
        const nguoiDangBL = duLieuTK.find((tk) => tk.id == item.idNguoiBL);

        return (
            <View style={{ backgroundColor: 'white', flexDirection: 'row', flex: 1, margin: 10 }}>
                <Image style={{ width: 50, height: 50 }} source={{ uri: nguoiDangBL?.avatar }} />
                <View style={{ backgroundColor: '#F5F5F5', marginStart: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{nguoiDangBL?.hoTen}</Text>
                    <Text style={{ fontSize: 14, marginTop: 5 }}>{item.noidung}</Text>
                </View>
            </View>
        );
    };
    //item Bài viết 
    const baiViet = ({ item }) => {
        const nguoiDang = duLieuTK.find((tk) => tk.id == item.idAccount);

        return (
            <View style={styles.baiViet}>
                <View style={styles.nguoiDangBai}>

                    <TouchableOpacity onPress={() => navigation.navigate('ChitietAcc', { duLieu: item.idAccount.toString() })} style={{ flexDirection: 'row' }}>
                        <Image style={{ width: 50, height: 50 }} source={{ uri: nguoiDang?.avatar }} />
                        <View style={styles.nameNDB}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{nguoiDang?.hoTen}</Text>
                            <Text>{thoiGianChenhLech(item.thoiGian)}</Text>
                        </View>
                    </TouchableOpacity>
                    {isAdmin&&(
                    <TouchableOpacity onPress={() => { sethienMenu(!hienMenu); setBaiViet(item);setnoiDungSua(item.noidung);setanhSua(item.anh);setbaiVietSua(item) }} style={{ height: 20 }}>
                        <Image style={{ width: 40, height: 20, alignItems: 'flex-start' }} source={require('../assets/icons/more.png')} />
                    </TouchableOpacity>
                    )}
                    {/* Menu */}
                    <Modal animationType='fade' transparent={true} visible={hienMenu}>
                        <View style={styles.menu}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderBottomWidth: 1 }}>
                                <Text style={{ color: '#4d97f3', fontSize: 20, fontWeight: 'bold', marginEnd: 15 }}>Menu</Text>
                                <TouchableOpacity onPress={() => sethienMenu(!hienMenu)} style={{ alignSelf: 'flex-end', margin: 10 }}>
                                    <Image style={{ width: 30, height: 30 }} source={require('../assets/icons/x-button.png')} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => clickXoa()} style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                                <Image style={{ width: 40, height: 40 }} source={require('../assets/icons/delete.png')} />
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginStart: 10 }}>Xóa bài viết</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { sethienMenu(!hienMenu); sethienMenuSua(!hienMenuSua) }} style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                                <Image style={{ width: 40, height: 40 }} source={require('../assets/icons/loop.png')} />
                                <Text style={{ fontSize: 18, fontWeight: 'bold', marginStart: 10 }}>Sửa bài viết</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    {/* Xóa */}
                    <Modal animationType='fade' transparent={true} visible={hienMenuXoa} >
                        <View style={styles.menuXoa}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', margin: 10, alignSelf: 'center' }}>Bạn chắc chắn muốn xóa bài viết!</Text>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => deleteById(BaiViet.id)} style={{ borderRadius: 10, backgroundColor: '#4d97f3', width: '40%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Đồng ý</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => sethienMenuXoa(!hienMenuXoa)} style={{ borderRadius: 10, borderColor: '#4d97f3', borderWidth: 1, width: '40%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#4d97f3', fontSize: 15, fontWeight: 'bold' }}>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    {/* Sửa */}
                    <Modal animationType='fade' transparent={true} visible={hienMenuSua} >
                        <View style={styles.menuSua}>
                            <Text style={{ width: '100%', textAlign: 'center', fontSize: 25, fontWeight: 'bold', alignSelf: 'center', paddingVertical: 10, borderBottomWidth: 1, }}>Sửa bài viết</Text>
                            <View>
                                <View style={styles.textAreaContainer} >
                                    <TextInput
                                        value={noiDungSua}
                                        style={styles.textArea}
                                        multiline={true}
                                        onChangeText={(text) => {setnoiDungSua(text);setbaiVietSua({ ...baiVietSua, noidung: text })}}
                                    />
                                </View>
                                <TouchableOpacity onPress={chonAnh}>
                                <Image source={{uri:anhSua}}style={styles.image} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 15, justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={()=>updateById(baiVietSua)} style={{ borderRadius: 10, backgroundColor: '#4d97f3', width: '40%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Đồng ý</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => sethienMenuSua(!hienMenuSua)} style={{ borderRadius: 10, borderColor: '#4d97f3', borderWidth: 1, width: '40%', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#4d97f3', fontSize: 15, fontWeight: 'bold' }}>Hủy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* Nội dung */}
                <Text style={{ fontSize: 16, fontWeight: '400', paddingHorizontal: 10, marginBottom: 5 }}>{item.noidung}</Text>
                {/* Ảnh */}
                <Image style={{ width: "100%", height: 300, marginBottom: 10, resizeMode: "cover" }} source={{ uri: item.anh }} />
                {/* Thống kê like,bình luận */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 20, height: 20, marginEnd: 5, }} source={require('../assets/icons/likes.png')} />
                        <Text >123</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginEnd: 5 }}>{soLuotBinhLuan[item.id]}</Text>
                        <Text>bình luận</Text>
                    </View>
                </View>
                <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center', marginBottom: 10 }} />
                {/* Nút like,comment,share */}
                <View style={styles.tuongTac}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleLikePress(item.id)}>
                        <Image style={{ width: 25, height: 25, marginEnd: 10, }} source={liked ? images[1] : images[0]} />
                        <Text >Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setidBVBL(item.id);setHienBinhLuan(!hienBinhLuan);downloadDataBL(item.id)}} style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 25, height: 25, marginEnd: 10, }} source={require('../assets/icons/comment.png')} />
                        <Text >Bình luận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>share(item.anh,item.noidung)} style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image style={{ width: 25, height: 25, marginEnd: 10, }} source={require('../assets/icons/share.png')} />
                        <Text >Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
                
                <Modal animationType="fade" transparent={true} visible={hienBinhLuan}>
                    <View style={styles.viewBL}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 25, marginStart: 20 }}>Bình luận</Text>
                            <TouchableOpacity onPress={() => setHienBinhLuan(!hienBinhLuan)} style={{ marginStart: 180 }}>
                                <Image style={{ width: 40, height: 40, marginEnd: 10, }} source={require('../assets/icons/thoat.png')} />
                            </TouchableOpacity>
                        </View>
                        <FlatList style={{ width: '100%' }}
                            data={dataBL}
                            renderItem={itemBinhLuan}
                            keyExtractor={(it) => it.id.toString()}
                        />
                        <View style={styles.textAreaContainerBL} >
                            <TextInput
                                placeholder='Nhập nội dung tại đây!'
                                style={styles.textAreaBL}
                                multiline={true}
                                onChangeText={(text) => setbinhLuan(text)}
                            />
                            <TouchableOpacity onPress={()=>postBinhLuan()} style={{ width: "10%", height: 35 }}>
                                <Image style={{ width: "100%", height: 35 }} source={require('../assets/icons/send.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            {isAdmin && (
                <View style={styles.btnThemBaiViet}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: tk?.avatar }} />
                    <Text onPress={() => navigation.navigate('Create',{taiBaiVietAdmin:taiBaiVietAdmin})} style={styles.textTBV}>Viết bài viết mới ở đây</Text>
                </View>
            )}
            <FlatList style={{ width: '100%' }}
                data={duLieuBaiViet}
                renderItem={baiViet}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
}

export default ListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#DCDCDC',
    },
    //Thêm bài viết
    btnThemBaiViet: {
        padding: 10,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 5,
    },
    textTBV: {
        fontSize: 17,
        padding: 10,
        borderWidth: 1,
        textAlign: 'left',
        flex: 1,
        borderRadius: 20,
        marginStart: 10,
    },
    //Bài viết
    baiViet: {
        backgroundColor: 'white',
        width: '100%',
        paddingBottom: 10,
        marginBottom: 10,
        alignSelf: 'center',
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
    //menu
    menu: {
        backgroundColor: '#F5F5F5', width: 175, height: 150, alignSelf: 'center', marginTop: 300, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        borderRadius: 20,
        justifyContent: 'center',

    },
    menuXoa: {
        backgroundColor: '#F5F5F5', width: 320, paddingBottom: 15, alignSelf: 'center', marginTop: 300, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        borderRadius: 20,
    },
    menuSua: {
        backgroundColor: '#F5F5F5', width: 390, paddingBottom: 15, alignSelf: 'center', marginTop: 50, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
        borderRadius: 20,
    },
    image: {
        alignSelf:'center',
        width: '97%',
        height: 350,
        marginTop: 16,
        resizeMode: 'cover',
      },
      textAreaContainer: {
        marginVertical:10,
        padding: 10,
      },
      textArea: {
        fontSize: 18,
        },
    //View like,comment share
    tuongTac: {
        height: 30,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30
    },
    //Bình luận
    viewBL: {
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
    textAreaContainerBL: {
        marginVertical:10,
        padding: 10,
        flexDirection:'row'
      },
      textAreaBL: {
        width:'89%',
        fontSize: 18,
        },
});
