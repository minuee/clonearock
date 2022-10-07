import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Text,ImageBackground, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {Badge} from 'react-native-elements';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();

import CommonUtils from './CommonUtils';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ImageSlider = ({images, imageBoxSize, activeBadgeColor, autoSlide, pressList}) => {
    const refImageSlide = useRef(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [playon, setPlayOn] = useState(true);
    
    useEffect(() => {
        let autoSlideInterval;
        let index = 0;
        const _autoSlide = () => {
            refImageSlide.current.scrollTo({x: SCREEN_WIDTH * index, animated: true});
            setPageIndex(index);
            index++;
            if (index === images.length) {
                index = 0;
            }
        };
        if (autoSlide && playon) {
            autoSlideInterval = setInterval(_autoSlide, 3000);
        }
        return () => {
            clearInterval(autoSlideInterval);
        };
    }, [autoSlide, images, playon]);

    return (
        <View style={{...styles.container}}>
            <ScrollView
                ref={refImageSlide}
                bounces={false}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={({nativeEvent}) => setPageIndex(Math.round(nativeEvent.contentOffset.x / SCREEN_WIDTH))}
                scrollEventThrottle={16}>
                {
                    images.map((item, index) => {
                    return (
                        <TouchableOpacity key={`imgSlider_${index}`} onPress={pressList[index]} activeOpacity={1}>
                            <ImageBackground
                                source={item}    
                                style={{...styles.bgImg, height: imageBoxSize}}
                                resizeMode={'cover'}
                            />
                        </TouchableOpacity>
                    );
                    })
                }
            </ScrollView>
            <View style={{...styles.viewBadge}}>
                {
                    images.map((item, index) => (
                        <Badge
                            key={`imgSliderPage_${index}`}
                            badgeStyle={{
                                backgroundColor: pageIndex === index ? activeBadgeColor : '#cccccc',
                                borderWidth: pageIndex === index ? CommonUtils.scale(2) : null,
                                borderColor: pageIndex === index ? activeBadgeColor : 'white',
                                width: CommonUtils.scale(10),
                                height: CommonUtils.scale(10),
                                borderRadius: CommonUtils.scale(50),
                            }}
                            containerStyle={{marginHorizontal: CommonUtils.scale(2)}}
                        />
                    ))
                }
            </View>
            <View style={{...styles.viewNumber}}>
                <Text style={styles.baseText}><Text style={styles.boldText}>{pageIndex+1}</Text>/{images.length}</Text>
                <Icon
                    name={playon ? "pause" : "caretright"}
                    style={{paddingLeft:5}}
                    size={CommonUtils.scale(13)}
                    color="#ffffff"
                    onPress={()=>setPlayOn(!playon) }
                />
            </View>
        </View>
    );
};

export default ImageSlider;

ImageSlider.propTypes = {
    imageBoxSize: PropTypes.number,
    activeBadgeColor: PropTypes.string,
    images: PropTypes.array.isRequired,
    autoSlide: PropTypes.bool,
    pressList: PropTypes.array,
};

ImageSlider.defaultProps = {
    imageBoxSize: 600,
    activeBadgeColor: 'transparent',
    autoSlide: false,
    pressList: [],
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',        
    },
    bgImg: {
        width: SCREEN_WIDTH,
    },
    viewBadge: {
        flexDirection: 'row',
        justifyContent: 'center',        
        position: 'absolute',
        bottom: CommonUtils.scale(15),
        alignSelf: 'center',
        
    },  
    viewNumber : {
        flexDirection: 'row',
        position: 'absolute',
        bottom: CommonUtils.scale(15),
        right: CommonUtils.scale(15),
        width:CommonUtils.scale(60),
        borderRadius:10,
        backgroundColor:'#000',
        opacity:0.7,
        justifyContent:'center',
        alignItems:'center'
    },  
    boldText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(13),
    },
    baseText : {
        color:'#555',        
        fontSize: CommonUtils.scale(13),
    }
});