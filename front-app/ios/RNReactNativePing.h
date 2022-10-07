//
//  RNReactNativePing.h
//  clonearock
//
//  Created by nohsn on 2022/08/08.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface RNReactNativePing : NSObject <RCTBridgeModule>

@end
