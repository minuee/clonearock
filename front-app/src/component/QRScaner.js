import React,{useRef, useEffect, useState,useContext} from 'react';
import { StyleSheet,View,Dimensions,Text,Image} from 'react-native';
import { Camera, CameraType } from "react-native-camera-kit";
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const base_color = mConst.baseColor;
const QRCODE_WAKE_IAMGE = require('../../assets/qrcode_waku.png');


const QRScaner = ({ setScanView,onBarCodeRead }) => {
    const refCamera = useRef(null);


    return (
        <View style={styles.fullContainer}>
            <View style={styles.qrcodeTextWrap}>
                <Text style={styles.infoLargeText}>QR코드를 스캔해 바로 송금하세요!</Text>
                <Text style={styles.infoSmallText}>#가상자산 송금 #리워드 송금</Text>
            </View>
            <Image source={QRCODE_WAKE_IAMGE} resizeMode='contain' style={styles.qrcodeWrap} />
            <Camera
                style={styles.scanner}
                ref={refCamera}
                cameraType={CameraType.Back} // Front/Back(default)
                zoomMode='on'
                focusMode='on'
                // Barcode Scanner Props
                scanBarcode={true}
                showFrame={true}
                laserColor="rgba(0, 0, 0, 0)"
                frameColor="rgba(0, 0, 0, 0)"
                surfaceColor="rgba(0, 0, 0, 0)"
                onReadCode={onBarCodeRead}
            />
            <View style={styles.fixedButton}>
                <Icon
                    name="close"
                    type='ionicon'
                    style={{paddingRight:5}}
                    size={CommonUtils.scale(30)}
                    color="white"
                    onPress={()=>setScanView(false) }
                />
            </View>
            <View style={styles.fixedBottomWrap}>
                <View style={styles.fixedBallWrap}>
                    <Icon
                        name="close"
                        type='ionicon'                        
                        size={CommonUtils.scale(30)}
                        color="white"
                        onPress={()=>setScanView(false) }
                    />
                </View>
            </View>
        </View>
    )
}

export default QRScaner;

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        zIndex:9999        
    },
    fixedButton : {
        position:'absolute',
        right:0,
        top:50,
        width:50,
        height:50,
        zIndex:10
    },
    fixedBottomWrap : {
        position:'absolute',
        left:0,
        bottom:100,
        width:SCREEN_WIDTH,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        zIndex:10
    },
    fixedBallWrap : {
        width:50,
        height:50,
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center',
    },
    scanner: { 
        flex: 1 
    },
    qrcodeTextWrap : {
        position:'absolute',        
        left: 20,
        top: SCREEN_HEIGHT*0.25,
        justifyContent: 'center',
        alignItems: 'center',
        width:SCREEN_WIDTH-40,
        zIndex:10
    },
    qrcodeWrap : {
        position:'absolute',        
        left: (SCREEN_WIDTH / 2) - ( SCREEN_WIDTH*0.35 ),
        top: SCREEN_HEIGHT*0.35,
        justifyContent: 'center',
        alignItems: 'center',
        width:SCREEN_WIDTH*0.7,
        height:SCREEN_WIDTH*0.7,
        zIndex:10
    },
    infoLargeText : {
        color:'#fff',        
        fontSize: CommonUtils.scale(15)
    },
    infoSmallText : {
        color:'#fff',        
        fontSize: CommonUtils.scale(13)
    },
});
