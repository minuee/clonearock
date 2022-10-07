//
//  RNVersionNumber.h
//  integrateapp
//
//  Created by seongnam noh on 26/03/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif

@interface RNVersionNumber : NSObject <RCTBridgeModule>

@end
