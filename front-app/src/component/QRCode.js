import React from 'react';
import { StyleSheet,View } from 'react-native';
import RNQRCode from 'react-native-qrcode-svg';

const QRCode = ({ value }) => (    
    <View style={styles.container}>
        <RNQRCode value={value} size={160} />
    </View>
)

export default QRCode;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});
