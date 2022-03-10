import React from 'react';
import { StyleSheet, Text,TextInput, View, AsyncStorage,Image,TouchableWithoutFeedback,Alert,Keyboard } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default class HomeRoute extends React.Component {

    _isMounted = false;

    UNSAFE_componentWillMount(){
        this._isMounted = true;
    }

    UNSAFE_componentWillUnmount(){
        this._isMounted = false;
    }

    constructor(props){
        super(props);
        this.state = {
            key:"",
            status:false,
            owner:"",
            plaque:"",
        };

    }

    async componentDidMount(){

        try {

            const usercode = await AsyncStorage.getItem('usercode');

            if (usercode) {

                this.setState({status:true});

                const { status } = await Permissions.askAsync(Permissions.LOCATION);

                if(status === "granted"){

                    const owner = await AsyncStorage.getItem('owner');
                    const plaque = await AsyncStorage.getItem('plaque');

                    this.setState({
                        owner: owner,
                        plaque: plaque
                    });

                    await Location.startLocationUpdatesAsync("bglocationtrack", {
                        accuracy: Location.Accuracy.BestForNavigation,
                        showsBackgroundLocationIndicator:true,
                        timeInterval: 3000,
                        foregroundService:{
                            notificationTitle:"VOBO KONUM TAKİP",
                            notificationBody:"Uygulamayı kapatmayınız",
                            notificationColor:"#e45213"
                        }
                    });

                }else{
                    Alert.alert("UYARI","Konum izni veriniz");
                }


            }else{
                this.setState({status:false});
            }

        } catch (error) {
            // Error retrieving data
        }



    }

    render() {

        return (
            <View style={{position:'relative',backgroundColor:'#e45213', width:'100%', height:'100%',justifyContent:'center',  alignItems:'center', alignContent:'center'}}>



                { this.state.status === false && <View style={{backgroundColor:'#e45213', width:'100%', height:'100%',justifyContent:'center',  alignItems:'center', alignContent:'center'}} >

                    <Image
                        style={{resizeMode: 'contain', height:50, top:120, position:'absolute', zIndex:9}}
                        source={require('./assets/logo.png')}
                    />

                    <TextInput
                        keyboardType={"numeric"}
                        placeholder={"XXXXXXXXXXXX"}
                        placeholderTextColor={'#e45213'}
                        onChangeText={text => {
                            this.setState({
                                key: text
                            });
                        }}
                        style={{ top:1, position:'relative', zIndex:99,  textAlign:'center', fontSize:20, height: 60, borderColor: 'white', width:'80%', backgroundColor:'white', borderWidth: 1 }}
                    />
                    <View/>
                    <TouchableWithoutFeedback onPress={async ()=>{

                        const usercode = await AsyncStorage.getItem('usercode');

                        if(usercode === null){


                            let formData    =   new FormData();

                            formData.append('key', this.state.key);

                            fetch("https://vobo.cloud/api/v1/plugin/post/gpstrackinglive", {
                                method: 'POST',
                                body: formData,
                            }).then(response => response.json()).then(async response => {
                                if(response.status === "success"){
                                    const usercode = await AsyncStorage.setItem('usercode',this.state.key);
                                    const owner = await AsyncStorage.setItem('owner',response.data.owner);
                                    const plaque = await AsyncStorage.setItem('plaque',response.data.plaque);
                                    this.setState({
                                        owner: response.data.owner,
                                        plaque: response.data.plaque
                                    });

                                    const { status } = await Permissions.askAsync(Permissions.LOCATION);

                                    if(status === "granted"){

                                        const owner = await AsyncStorage.getItem('owner');
                                        const plaque = await AsyncStorage.getItem('plaque');

                                        this.setState({
                                            owner: owner,
                                            plaque: plaque
                                        });

                                        await Location.startLocationUpdatesAsync("bglocationtrack", {
                                            accuracy: Location.Accuracy.BestForNavigation,
                                            timeInterval: 3000,
                                            showsBackgroundLocationIndicator:true,
                                            foregroundService:{
                                                notificationTitle:"VOBO KONUM TAKİP",
                                                notificationBody:"Uygulamayı kapatmayınız",
                                                notificationColor:"#e45213"
                                            }
                                        });


                                    }else{
                                        Alert.alert("UYARI","Konum izni veriniz");
                                    }


                                    this.setState({status:true});
                                }else{
                                    Alert.alert("UYARI",response.message);
                                }
                            }).catch(()=>{
                                Alert.alert("UYARI","Bir hata oluştur");
                            });


                        }else{
                            Alert.alert("UYARI ","Takip kodu aktif");
                        }


                    }}>
                        <View style={{width:'80%', height:40, backgroundColor:'#efefef', marginTop: 10, alignContent:'center', justifyContent:'center', alignItems:'center'}}>
                            <Text>OTURUM AÇ</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>}

                { this.state.status  &&
                    <View style={{backgroundColor:'#e45213', width:'100%', height:'100%',justifyContent:'center',  alignItems:'center', alignContent:'center'}}>

                        <Image
                            style={{resizeMode: 'contain', height:50, top:120, position:'absolute', zIndex:9}}
                            source={require('./assets/logo.png')}
                        />

                        <Text style={{ lineHeight:40, paddingLeft:10, width:'80%', height:40, backgroundColor:'white', marginTop: 10, alignContent:'center', justifyContent:'center', alignItems:'center'}} >Kullanıcı : {this.state.owner}</Text>
                        <Text style={{lineHeight:40, paddingLeft:10, width:'80%', height:40, backgroundColor:'white', marginTop: 10, alignContent:'center', justifyContent:'center', alignItems:'center'}} >Plaka : {this.state.plaque}</Text>
                        <Text style={{lineHeight:40, paddingLeft:10, width:'80%', height:40, backgroundColor:'#59c34e',color:'white', marginTop: 10, alignContent:'center', justifyContent:'center', alignItems:'center'}} >Sunucu bağlantısı yapıldı</Text>

                        <TouchableWithoutFeedback onPress={async ()=>{
                            await AsyncStorage.removeItem('usercode');
                            await AsyncStorage.removeItem('owner');
                            await AsyncStorage.removeItem('plaque');
                            this.setState({status:false});

                            await TaskManager.unregisterTaskAsync("bglocationtrack");

                        }}>
                            <View style={{width:'80%', height:40, backgroundColor:'#efefef', marginTop: 10, alignContent:'center', justifyContent:'center', alignItems:'center'}}>
                                <Text>OTURUM KAPAT</Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                }

            </View>
        );




    }

}



TaskManager.defineTask("bglocationtrack", async ({ data: { locations }, error }) => {

    const usercode = await AsyncStorage.getItem('usercode');

    if(usercode){

        if (error) {
            return;
        }

        let formData    =   new FormData();

        formData.append('latitude', locations[0].coords.latitude);
        formData.append('longitude', locations[0].coords.longitude);
        formData.append('speed', locations[0].coords.speed);
        formData.append('key', usercode);

        fetch("https://vobo.cloud/api/v1/plugin/post/gpstrackingliveup", {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then((response)=>{

        }).catch((response)=>{
            Alert.alert("UYARI","Arkaplan konum takibi durduruldu. (sunucu)");
        });

    }

});
