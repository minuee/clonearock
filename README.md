
<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* [https://reactnative.dev/docs/environment-setup]

### Built With

* ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![Xcode](https://img.shields.io/badge/Xcode-007ACC?style=for-the-badge&logo=Xcode&logoColor=white)
* ![Android Studio](https://img.shields.io/badge/Android%20Studio-3DDC84.svg?style=for-the-badge&logo=android-studio&logoColor=white)


### Installation

1. Clone the repo
   ```sh
   git clone https://gitlab.dreamsecurity.com/nohsn/clonearock.git
   ```
2. 서버 환경설정
    ```sh
    1. install redis
    2. #cd server 
       #npm install  //node 최소 v12이상 
       #npm run devstart // 서버가동 nodemon이용
    ```
3. 라이브러리 
    ```sh
    npm install
    ```
    
    만약 에러가 있다면
    ```sh
    npm install --force
    ```

    iOS인 경우 추가로 
    ```sh
    cd ios && pod install && cd ..
    ```
4. 실행 (package.json의 script 참조)
    1. Android : Android Studio의 Emulator설정 및 ndk등이 설치되어 있다는 가정하에, 등록되어 있는 Emulator가 실행이 된다
                또는 실기기가 개발자 디버깅모드가 설정이 되어 있다면  usb에 연결하고 실행
        ```
        $npm run android OR $yarn android OR $react-native run-android
        ```
    2. iOS : Xcode가 설치되어 있다는 가정하에
        ```
        $npm run ios OR $yarn ios OR $react-native run-ios
            if failed시 Xcode에서 Clean build folder실행후 빌드실행
        ```

### 주요 기능 안내
1. react-navigation 사용
    ```
    구조 : stackContainer >  Drawer > stack.screen > bottom-tabs > stack.screen
    메소드 : navigation.navigate(), navigation.goBack(), navigatioon.toggleDrawer()등
    ```
2. Animated ( using Core Component )
    
3. rn-nodeify 설정필요
    ```
    https://blog.naver.com/lena47/222738510821 ( 이웃에게만 공개중 )
    ```

<<<<<<< HEAD
<p align="right">(<a href="#top">back to top</a>)</p>

=======
<<<<<<< HEAD
<p align="right">(<a href="#top">back to top</a>)</p>

=======
4. Module추가
    ```
    yarn add iamport-react-native (핸드폰 본인인증을 위함)
    yarn add react-native-iphone-x-helper (iphone height 참고용)
    yarn add Base64 ( 통신사 ci 암호화 라이브러리 단순 atob )
    yarn add ethereumjs-util ( AOS 오류로 인한 추가)
    yarn add react-native-bip39 ethereumjs-wallet ( HD Key관리를 위함 )
    yarn add react-query ( 서버상태관리 _ 테스트용 )
    yarn add htmlparser2 ( html 파싱용 라이브러리 추가 )
    ```
>>>>>>> main
>>>>>>> d82bbdfe90943d70f654dcec89472a68708c1fb4

## 참고내역
1. 코인거래소의 오픈API
    ```
    빗썸 : https://api.bithumb.com/public/ticker/ALL
    업비트 : https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-BTC
    코인원 : https://api.coinone.co.kr/ticker?currency=all
    코빗 : https://api.korbit.co.kr/v1/ticker?currency_pair=btc_krw
<<<<<<< HEAD
=======
    ```
2. HD Wallet
    ```
    BIP-0044 : https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    ```
3. 특이사항
    ```
    2022.07.08 드림시큐리티 본인인증 적용
    2022.08.05 HD Wallet 생성 프로세스 적용
    2022.08.05 HD Wallet 복구 프로세스 적용
    2022.08.08 코인추가 프로세스 적용
    2022.08.08 회원등록프로세스 API적용 ( 신규 또는 기등록자 )
    2022.08.10 AOS 문법오류 및 ws Address처리
>>>>>>> main
    ```