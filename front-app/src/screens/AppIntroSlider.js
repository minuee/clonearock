import React from 'react';
import {StyleSheet,FlatList,View,Dimensions,Text,TouchableOpacity,Platform,StatusBar,I18nManager,PixelRatio} from 'react-native';
import DefaultSlide from '../component/DefaultSlide';
import AsyncStorage from '@react-native-async-storage/async-storage';
//공통상수
import CommonUtils  from '../utils/CommonUtils';
import mConst from '../utils/Constants';
const { width, height } = Dimensions.get('window');

const isIphoneX = CommonUtils.isIphoneX();

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android';

export default class AppIntroSlider extends React.Component {

    static defaultProps = {
        activeDotStyle: {
            backgroundColor: mConst.baseColor
        },
        dotStyle: {
            backgroundColor: '#666'
        },
        skipLabel: '건너뛰기',
        doneLabel: '시작하기',
        nextLabel: '다음',
        prevLabel: '이전',
        buttonStyle: null,
        buttonTextStyle: null,
        paginationStyle: null,
        showDoneButton: true,
        showNextButton: true,
        savedPageNum: 0,
    };
    state = {
        width,
        height,
        activeIndex: 0,
    };

    async UNSAFE_componentWillMount() {
        const savedPageNum = await AsyncStorage.getItem('savedPageNum');
        this.goToSlide(savedPageNum && parseInt(savedPageNum) || 0);
    }

    goToSlide = async pageNum => {
        this.setState({ activeIndex: pageNum });
        this.flatList.scrollToOffset({
            offset: this._rtlSafeIndex(pageNum) * this.state.width,
        });
    };

    // Get the list ref
    getListRef = () => this.flatList;

    _onNextPress = () => {
        this.goToSlide(this.state.activeIndex + 1);
        this.props.onSlideChange &&
        this.props.onSlideChange(this.state.activeIndex + 1, this.state.activeIndex);
    };

    _onPrevPress = () => {
        this.goToSlide(this.state.activeIndex - 1);
        this.props.onSlideChange &&
        this.props.onSlideChange(this.state.activeIndex - 1, this.state.activeIndex);
    };

    _onPaginationPress = index => {
        const activeIndexBeforeChange = this.state.activeIndex;
        this.goToSlide(index);
        this.props.onSlideChange && this.props.onSlideChange(index, activeIndexBeforeChange);
    };

    _renderItem = flatListArgs => {
        const { width, height } = this.state;
        const props = { ...flatListArgs, dimensions: { width, height } };
        return (
            <View style={{ width, flex: 1 }}>
                {this.props.renderItem ? (
                    this.props.renderItem(props)
                ) : (
                    <DefaultSlide bottomButton={this.props.bottomButton} {...props} />
                )}
            </View>
        );
    };

    _renderButton = (name, onPress) => {
        const show = this.props[`show${name}Button`];
        const content = this.props[`render${name}Button`]
        ? this.props[`render${name}Button`]()
        : this._renderDefaultButton(name);
        return show && this._renderOuterButton(content, name, onPress);
    };

    _renderDefaultButton = name => {
        let content = (
            <Text style={[styles.buttonText, this.props.buttonTextStyle]}>
                {this.props[`${name.toLowerCase()}Label`]}
            </Text>
        );
        if (this.props.bottomButton) {
            content = (
                <View
                    style={[
                        styles.bottomButton,
                        (name === 'Skip' || name === 'Prev') && {
                        backgroundColor: 'transparent',
                    },
                    this.props.buttonStyle,
                ]}
                >
                    {content}
                </View>
            );
        }
        return content;
    };

    _renderOuterButton = (content, name, onPress) => {
        const style = name === 'Skip' || name === 'Prev' ? styles.leftButtonContainer : styles.rightButtonContainer;
        return (
            <View style={!this.props.bottomButton && style}>
                <TouchableOpacity
                    onPress={onPress}
                    style={this.props.bottomButton ? styles.flexOne : this.props.buttonStyle}
                >
                    {content}
                </TouchableOpacity>
            </View>
        );
    };

    _renderNextButton = () => this._renderButton('Next', this._onNextPress);

    _renderPrevButton = () => this._renderButton('Prev', this._onPrevPress);

    _renderDoneButton = () => this._renderButton('Done', this.props.onDone && this.props.onDone);

    _renderSkipButton = () =>    
        this._renderButton('Skip', () =>
        this.props.onSkip ? this.props.onSkip() : this.goToSlide(this.props.slides.length - 1)
    );

    _renderPagination = () => {
        const isLastSlide = this.state.activeIndex === this.props.slides.length - 1;
        const isFirstSlide = this.state.activeIndex === 0;

        const skipBtn = (!isFirstSlide && this._renderPrevButton()) || (!isLastSlide && this._renderSkipButton());
        const btn = isLastSlide ? this._renderDoneButton() : this._renderNextButton();

        let totalSlide = this.props.slides.length;
        let nowSlide = parseInt(this.state.activeIndex)+parseInt(1);
        if ( totalSlide === parseInt(this.state.activeIndex)+parseInt(1) ) {
            return (
                <View style={[styles.paginationContainer2,{backgroundColor:mConst.baseColor,alignItems:'center',justifyContent:'center'}]}>
                    <TouchableOpacity onPress={() => this.props.onSkip()}>
                        <Text style={{color:'#ffffff',fontSize: 18,fontWeight:"bold"}}>시작하기</Text>
                    </TouchableOpacity>
                </View>
            )
        } else{
            return (
                <View style={[styles.paginationContainer, this.props.paginationStyle]}>          
                    <View style={{position:'absolute',left:0,top:0,height:3,width:parseInt(nowSlide/totalSlide*100) + '%',backgroundColor:mConst.baseColor}} />
                    {btn}
                    {skipBtn}
                </View>
            );
        }
    };

    _rtlSafeIndex = i => (isAndroidRTL ? this.props.slides.length - 1 - i : i);

    _onMomentumScrollEnd = async e => {
        const offset = e.nativeEvent.contentOffset.x;
        const newIndex = this._rtlSafeIndex(Math.round(offset / this.state.width));
        if (newIndex === this.state.activeIndex) return;
        await AsyncStorage.setItem('savedPageNum', newIndex.toString());
        const lastIndex = this.state.activeIndex;
        this.setState({ activeIndex: newIndex });
        this.props.onSlideChange && this.props.onSlideChange(newIndex, lastIndex);
    };

    _onLayout = () => {
        const { width, height } = Dimensions.get('window');
        if (width !== this.state.width || height !== this.state.height) {
            this.setState({ width, height });
            const func = () => {
                this.flatList.scrollToOffset({
                    offset: this._rtlSafeIndex(this.state.activeIndex) * width,
                    animated: false,
                });
            };
            Platform.OS === 'android' ? setTimeout(func, 0) : func();
        }
    };

    render() {
        const {
            hidePagination,
            activeDotStyle,
            dotStyle,
            skipLabel,
            doneLabel,
            nextLabel,
            prevLabel,
            buttonStyle,
            buttonTextStyle,
            renderItem,
            data,
            ...otherProps
        } = this.props;

        return (
            <View style={styles.flexOne}>
                <FlatList
                    ref={ref => (this.flatList = ref)}
                    data={this.props.slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    style={styles.flatList}
                    renderItem={this._renderItem}
                    onMomentumScrollEnd={this._onMomentumScrollEnd}
                    extraData={this.state.width}
                    onLayout={this._onLayout}
                    {...otherProps}
                />
                {!hidePagination && this._renderPagination()}
        </View>
        );
    }
}

const styles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
    flatList: {
        flex: 1,
        flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
    },
    paginationContainer: {
        position: 'absolute',
        padding: isIphoneX ? 35 : 30,
        bottom: 0,
        left: 0,
        right: 0,
    },
    paginationContainer2: {
        position: 'absolute',
        padding:20,
        bottom:0,
        left: 0,
        right: 0,
    },
    paginationDots: {
        height: isIphoneX ? 16 : 2,//,16,
        margin: 16,
        flexDirection: isAndroidRTL ? 'row-reverse' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    leftButtonContainer: {
        position: 'absolute',
        left: 0,
    },
    rightButtonContainer: {
        position: 'absolute',
        right: 0,
    },
    bottomButton: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        backgroundColor: 'transparent',
        color: mConst.baseColor,
        fontSize: 14,
        padding: 12,
    },
});