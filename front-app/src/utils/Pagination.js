import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity,PixelRatio,Image} from 'react-native';

import mConst from '../utils/Constants';
import CommonUtil from '../utils/CommonUtils';

const BTN_FIRST = require('../../assets/btn_first.png');
const BTN_PREV = require('../../assets/btn_prev.png');
const BTN_NEXT = require('../../assets/btn_next.png');
const BTN_LAST = require('../../assets/btn_last.png');

const Pagination = (props) => {   
	
	const { totalCount,currentPage,ismore,DefaultPaginate,onPageChange} = props.screenState;
	const pageCount = Math.ceil(totalCount / DefaultPaginate);
	const maxDisplay = pageCount > 4 ? 5 : pageCount;
	//console.log('Pagination',pageCount,currentPage,maxDisplay)
	if (pageCount === 1) return null; // 1페이지 뿐이라면 페이지 수를 보여주지 않음
	const pages = CommonUtil.getRange2(pageCount,currentPage,maxDisplay);	
	//console.log('pages',pages)
    const [pageIndex, setPageIndex] = useState(0);
    useEffect(() => {        
    
    }, []);

    return (
        <View style={{...styles.container}}>
            <View style={styles.commneBtnWrap}>
				{currentPage > 1 &&
				<TouchableOpacity style={styles.commneBtn} onPress={()=>onPageChange(currentPage-10<0 ? 1 : currentPage-10)}  >
					<Image source={BTN_FIRST} resizeMode={'contain'} style={styles.fixedIcon} />
				</TouchableOpacity>
				}
				{currentPage > 1 &&
				<TouchableOpacity style={styles.commneBtn} onPress={()=>onPageChange(currentPage-1)}  >
					<Image source={BTN_PREV} resizeMode={'contain'} style={styles.fixedIcon} />
				</TouchableOpacity>
				}
			</View>
			<View style={{flex: pages.length > 4 ? 3 : 2,flexDirection:'row',justifyContent:'space-between',}}>
				{
				pages.map((item, index) => {  
					if ( item < 1 ) {
						return (					
							<View key={index} />
						)
					}else{
						return (					
							<TouchableOpacity 
								key={index} 
								onPress={()=>onPageChange(item)}  
								style={currentPage === item ? styles.commnePageCheckBtn : styles.commnePageBtn}>
								<Text style={[styles.textSize12,currentPage === item ? styles.fontColorWhite: styles.fontColor555]}>{item}</Text>
							</TouchableOpacity>
						)
					}
				})
				}
			</View>
			<View style={styles.commneBtnWrap} >
				{currentPage < pageCount &&
				<TouchableOpacity style={styles.commneBtn} onPress={()=>onPageChange(currentPage+1 > pageCount ? pageCount : currentPage+1)}>
					<Image source={BTN_NEXT} resizeMode={'contain'} style={styles.fixedIcon} />
				</TouchableOpacity>
				}
				{currentPage < pageCount &&
				<TouchableOpacity style={styles.commneBtn} onPress={()=>onPageChange(currentPage+10 > pageCount ? pageCount : currentPage+10)}  >
					<Image source={BTN_LAST} resizeMode={'contain'} style={styles.fixedIcon} />
				</TouchableOpacity>
				}
			</View>
        </View>
    );
};

export default Pagination;

const styles = StyleSheet.create({
    container: {
        flex:1,
		flexDirection:'row',
		justifyContent:'space-between',
		marginTop:15
    },
	commneBtnWrap : {
		flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'
	},
	commneBtn : {
		justifyContent:'center',alignItems:'center'
	},
	commnePageCheckBtn : {
		paddingVertical:5,paddingHorizontal:10,justifyContent:'center',alignItems:'center',borderColor:mConst.baseColor,borderWidth:1,borderRadius:5,backgroundColor:mConst.baseColor
	},
	commnePageBtn : { 
		paddingVertical:5,paddingHorizontal:10,justifyContent:'center',alignItems:'center',borderColor:'#ccc',borderWidth:1,borderRadius:5,
	},
	fixedIcon : {
        width:CommonUtil.scale(20),height:CommonUtil.scale(20)
    },
    textSize12 : {fontSize:PixelRatio.roundToNearestPixel(12),lineHeight:PixelRatio.roundToNearestPixel(12)*1.5},
    fontColorDefault : { color : '#222'},
    fontColorBase : { color : mConst.baseColor},
    fontColorWhite : {color : '#fff'},
    fontColorRed : { color : '#ff0000'},
    fontColorBlue : { color : '#1140fc'},
    fontColor000 : { color : '#000000'},
    fontColor222 : { color : '#222222'},
    fontColor555 : { color : '#555555'},
    fontColor777 : { color : '#777777'},
    fontColor999 : { color : '#999999'},
    fontColorccc : { color : '#ccc'},
});