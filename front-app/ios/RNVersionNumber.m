//
//  RNVersionNumber.m
//  integrateapp
//
//  Created by seongnam noh on 26/03/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "RNVersionNumber.h"

@implementation RNVersionNumber

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  return @{@"appVersion"  : [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
           @"buildVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleVersionKey],
           @"bundleIdentifier"  : [[NSBundle mainBundle] bundleIdentifier]
           };
  
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
