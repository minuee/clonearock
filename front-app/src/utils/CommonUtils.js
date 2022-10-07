import {Dimensions, PixelRatio, Platform} from 'react-native';
import Toast from 'react-native-simple-toast';

import '../../shim'; 
import crypto from 'crypto';

const {width, height} = Dimensions.get('window');
const dimensions = width < height ? width : height;
const guidelineBaseWidth = 360;


const getMobileHtml = contents => `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="format-detection" content="telephone=no" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
  <title>PRMagnet 이용약관</title>
  <style type="text/css">
    * {
      margin: 0;
      padding: 0;
      letter-spacing: -0.5px;
      line-height: 1.6;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
        "Helvetica", "Arial", sans-serif !important;
    }
    body {
      margin: 0;
      padding: 15px;
      font-size: 14px;
      -webkit-text-size-adjust: none;
    }
    ul,
    li {
      list-style: none;
    }
    table {
      border-spacing: 0;
      padding: 0;
      border: 0;
      border-collapse: collapse;
    }
    th,
    td {
      border: solid 1px #000000;
      padding: 10px;
      margin: 0;
    }
  </style>
</head>
<body>
${contents}
</body>
</html>
`
class Util {
  isEmpty = (str) => {
      const isUndefined = Object.is(str, undefined);
      return isUndefined || str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
  };

  scale = size => {
      return PixelRatio.roundToNearestPixel((dimensions / guidelineBaseWidth) * size);
  };

  fn_call_toast = (message) => {
      Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
  };

  fn_call_toast_center = (message) => {
      Toast.showWithGravity(message, Toast.SHORT, Toast.CENTER);
  };

  convertUnixToDate = (unix) =>  {
      const happyNewYear = new Date(unix*1000);
      //console.log('happyNewYear',happyNewYear)
      //const year = happyNewYear.getFullYear(); 
      //const month = happyNewYear.getMonth() + 1; 
      ///const date = happyNewYear.getDate();

      //const result = `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`
      return happyNewYear.toISOString().replace("T", " ").replace(/\..*/, '');;
  };

  setMinuteSeries = ( nowMinute) => {
      let returnData = [];
      const limiiTimes = parseInt(nowMinute)+10;
      for ( let i = nowMinute; i < limiiTimes ; i++) {
          returnData.push(i > 60 ? i-60 : i );
      }
      return returnData;
  };

  termMakeRandon(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  currencyFormat(num) {
    let num2 = parseInt(num);
    return num2.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }  

  AddComma(num) {
      let regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ',');
  };

  isIphoneX = () => {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 780 || dimen.width === 780)
          || (dimen.height === 812 || dimen.width === 812)
          || (dimen.height === 844 || dimen.width === 844)
          || (dimen.height === 896 || dimen.width === 896)
          || (dimen.height === 926 || dimen.width === 926))
    );
  }

  strToBuffer = (str) => {
      let buf = new ArrayBuffer(str.length);
      let bufView = new Uint8Array(buf);
      for ( let i = 0 ,strlen = str.length; i < strlen ; i++) {
          bufView[i] = str.charCodeAt(i);
      }      
      return bufView;
  }

  getRange2 = (size, startAt = 1,maxDisplay) => {
    if ( size > maxDisplay && startAt < 2) {
        return [...Array(maxDisplay).keys()].map(i => i + startAt);
    }else if ( size > maxDisplay && startAt < 3) {
        return [...Array(maxDisplay).keys()].map(i => i + startAt -1);
    }else if ( size > startAt+maxDisplay && startAt >= 3 ) {
        return [...Array(maxDisplay).keys()].map(i => i + startAt-2);            
    }else if ( size < startAt+maxDisplay && size < startAt+1 ) {
        return [...Array(maxDisplay).keys()].map(i => startAt-maxDisplay+i+1);
    }else if ( size < startAt+maxDisplay && size < startAt+2 ) {
        return [...Array(maxDisplay).keys()].map(i => startAt-maxDisplay+i+2);
    }else if ( size < startAt+maxDisplay && size < startAt+3 ) {
        return [...Array(maxDisplay).keys()].map(i => startAt-maxDisplay+i+3);
    }else if ( size < startAt+maxDisplay && size < startAt+4 ) {
        return [...Array(maxDisplay).keys()].map(i => startAt - 2 + i);
    }else{
        return [...Array(maxDisplay).keys()].map(i => startAt - 2 + i);
    }
  }
    
  renderHtml = ( data ) => {
      return getMobileHtml(data)
  }

  randIdCreator = () => {
      // eslint-disable-next-line
      const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      return `random${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}${S4()}`;
  }

  getRandNums = (min, max, howmany, excludedNum) => {
    var v = new Array();         
    v[0] = excludedNum; //제외할 숫자를 미리 넣어 두기        
    var cnt=1; //배열 카운트 0번을 제외한 1부터 시작        
    var sReturn='';        
    while (cnt<=howmany) {//뽑아야 할 개수가 다 찰 동안 루프 순환        
        rndN = this.randBetween(min, max); //구간 내에서 무작위 수 1개 추출        
        if (v.indexOf(rndN)==-1) {//기존에 뽑히지 않았다면,        
            v[cnt] = rndN; //배열에 기존과 중복되지 않는 무작위 수 1개 추가        
            cnt++; //배열 카운트 추가        
        }
    }
    return v.filter((item) => item != null);
    /* for (i=1;i<v.length;i++) {//배열 1번부터 리턴 스트링 조인        
        sReturn += v[i]+',';        
    }        
    return sReturn.substr(0,sReturn.length-1); //마지막 , 를 제외한 문자열 최종 리턴 */
  }

  randBetween = (min, max)  =>{
    return Math.floor((Math.random()*(max-min+1))+min);
  }
  
  callAPI = async (url, options = null, FETCH_TIMEOUT = 30000, requiredLogin = false, signal = null) => {
    const myTimeout =  this.isEmpty(FETCH_TIMEOUT) ? 30000 : FETCH_TIMEOUT;
    if (requiredLogin) {
      const isLogin = this.isLoginCheck();
      if (isLogin) {
        return this.requestAPI(url, options, myTimeout, signal);
      } else {
        // Alert.alert('', '로그인이 필요한 서비스 입니다.');
        throw new Error('requiredLogin');
      }
    } else {
      return this.requestAPI(url, options, myTimeout, signal);
    }
  };
    
  requestAPI = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
    const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
    const apiKey = null;
    try {
      if (options === null) {
        options = {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            ApiKey: apiKey,
          },
        };
      } else {
        const tmpHeaders = options.headers
          ? typeof options.headers.map !== 'undefined'
            ? options.headers.map
            : options.headers
          : {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            };
        let arrHeaders = [];
        let arrHeaderKeys = [];
        Object.keys(tmpHeaders).forEach(item => {
          arrHeaders[item.toLowerCase()] = tmpHeaders[item];
          arrHeaderKeys.push(item.toLowerCase());
        });
        let newHeaders = {};
        arrHeaderKeys.forEach((value, index) => {
          let objKey = '';
          if (value === 'accept') {
            objKey = 'Accept';
          } else if (value === 'content-type') {
            objKey = 'Content-Type';
          } else if (value === 'apikey') {
            objKey = 'ApiKey';
          } else {
            objKey = value;
          }
          const obj = {[objKey]: arrHeaders[value]};
          newHeaders = {...newHeaders, ...obj};
        });
        const contentType =
          options.method && options.method.toUpperCase() === 'PUT' || options.method && options.method.toUpperCase() === 'DELETE'
            ? 'application/x-www-form-urlencoded'
            : 'application/json; charset=UTF-8';
        const receivedApiKey = newHeaders.ApiKey ? newHeaders.ApiKey : newHeaders.apiKey;
        options.headers = {
          ...newHeaders,
          'Content-Type': contentType, 
          ApiKey: receivedApiKey ? receivedApiKey : apiKey,
        };
      }
      const response = await this.fetchWithTimout(url, options, FETCH_TIMEOUT, signal);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      throw new Error(error);
    }
  };
    
  // fetch with timeout
  fetchWithTimout = async (url, options = null, FETCH_TIMEOUT = 30000, signal = null) => {
    return Promise.race([
      fetch(url, options, signal),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), FETCH_TIMEOUT),
      ),
    ]);
  };
 
  /**
    * 패스워드 생성기
    */
  generatePassword = ( ci, pincode ) => {
    let pass = '';
    const key =  this.getPrticleCIHash(ci);
    const n = pincode.length;
    for ( let i = 0; i < n; i++ ) {
        pass += pincode[i] + key[(i + 2 ) * 2];
    }    
    const abc = crypto.createHash('sha256').update(pass).digest('hex')
    return abc;
    //return CryptoJS.HmacSHA256(pass).toString();
  }

  getPrticleCIHash = ( ci ) => {
    let ciParticle = '';
    let i;
    const n = ci.length;
    for ( i = 0; i < n; i = ( i + 2 ) * 2 ) {
        ciParticle += ci[i];
    }
    const abc2 = crypto.createHash('sha256').update(ciParticle).digest('hex')
    return abc2;
    //return crypto.HmacSHA256(ciParticle);
  }

  getRandomLetters = () => {
    const str  = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return str;
  }

  getUUID = () =>  { // uuid 생성
    let uuid = '';
    uuid += this.getRandomLetters();
    uuid += this.getRandomLetters() + '-';
    uuid += this.getRandomLetters() + '-';
    uuid += this.getRandomLetters() + '-';
    uuid += this.getRandomLetters() + '-';
    uuid += this.getRandomLetters();
    uuid += this.getRandomLetters();

    return uuid;
  }

  /* 니모닉 암호화 */
  cipherMnemonic = async(myCeriti, mnemonic) => {
    const masterKey = await this.generateMasterKey(myCeriti)
    console.log('cipherMnemonic 1',masterKey)
    const cipher = crypto.createCipher('aes-256-cbc', masterKey);
    console.log('cipherMnemonic cipher',cipher)
    let result = cipher.update(mnemonic, 'utf8', 'base64');
    console.log('cipherMnemonic result 1',result)
    result += cipher.final('base64');
    console.log('cipherMnemonic result 2',result)
    return result;    
  }
  /* 니모닉 복호화 */
  mnemonicCipher = async(myCeriti, mnemonic) => {
    const masterKey = await this.generateMasterKey(myCeriti)
    ///console.log('masterKeymasterKey',masterKey)
    const decipher = crypto.createDecipher('aes-256-cbc', masterKey);
    let result2 = decipher.update(mnemonic.toString(), 'base64', 'utf8');
    ///console.log('mnemonicCipher result 1',result2)
    result2 += decipher.final('utf8');
    //console.log('mnemonicCipher result 2',result2)
    return result2;
  }

  generateMasterKey = async(myCeriti) => {    
    const ci = this.getPrticleCIHash(myCeriti.ci);
    const phone_number = myCeriti.phone_number;
    const masterKey = this.generateMasterKey2(ci, phone_number);
    return masterKey;
  }

  generateMasterKey2 = (ci, phone_number) => {
    const iv = '6Le0DgMTAAAAANokdfEial';
    const key = iv + ci + phone_number;
    const ret_md5 = crypto.createHash('md5').update(key).digest('hex');
    return ret_md5.toString();
  }
}

const CommonUtil = new Util();
export default CommonUtil;