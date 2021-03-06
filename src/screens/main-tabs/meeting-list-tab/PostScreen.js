import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {MainWrapper} from '../../../components/common/MainWrapper';
import ScreenHeader from '../../../components/common/ScreenHeader';
import {
  Body3,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
} from '../../../components/design-system/FontSystem';

import VisualDesign from '../../../assets/images/visual-design.png';
import EwhaLogo from '../../../assets/images/ewha-logo.png';
import Capture from '../../../assets/images/capture.png';
import NoFlower from '../../../assets/images/no-flower.png';
import Button from '../../../components/common/SubmitButton';
import {generateQuestion} from '../../../redux/slices/question';
import {useDispatch} from 'react-redux';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {API_URL} from '../../../common/constant';
import {createPost} from '../../../redux/slices/post';
import {uploadPostImage} from '../../../redux/slices/image';
import {postFlowerImagePath} from '../garden-tab/imagePath';

const PostScreen = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const meetingId = route.params.meetingInfo.id;
  const userId = route.params.userId;
  const groupInfo = route.params.groupInfo;
  const groupId = route.params.groupInfo.id;

  const dispatch = useDispatch();

  const backgroundColors = [
    '#A396FF',
    '#D3F463',
    '#406AFF',
    // '#FF5E3A',
    // '#FFD7B1',
    // '#47FE7A',
    // '#F7C1CF',
    '#0ABAAB',
    '#FDBC2A',
    '#C6B8F5',
  ];

  const optionsId = [1, 2, 3, 4];

  const [questionArray, setQuestionArray] = useState([]);
  const [answerArray, setAnswerArray] = useState([]);
  const [cardRef, setCardRef] = useState(null);
  const [photoData, setPhotoData] = useState(new FormData());
  const [photoUri, setPhotoUri] = useState(null);

  const [isPostSubmitted, setIsPostSubmitted] = useState(false);
  const [flowerId, setFlowerId] = useState(0);

  const [goNext, setGoNext] = useState(false);

  useEffect(() => {
    dispatch(generateQuestion({meetingId, userId}))
      .unwrap()
      .then(questionArray => {
        questionArray.push({
          content: '????????? ?????? ???????????? ????????? ?????????.',
          options: {},
        });
        questionArray.push({});
        setQuestionArray(questionArray);
      });
  }, []);

  useEffect(() => {
    console.log(answerArray);
  }, [answerArray]);

  const handleSelectOption = (index, val) => {
    // index = ?????? ?????? - 1, val = ?????? ??????
    let cp = [...answerArray];
    const answerObject = {
      question: questionArray[index].content,
      answer: questionArray[index].options[val],
    };
    const filteredAnswer = answerArray.filter(
      qa => qa.question !== answerObject.question,
    ); //????????? ?????? object??? ?????????.
    if (filteredAnswer.length < cp.length) {
      // ????????? ?????? ??? ??????????????? ???????????? ????????? ?????????, ??? ?????? ????????? ??? ????????? ?????? ?????? ?????? ?????? ??????
      cp = [...filteredAnswer];
      // cp??? ????????? ????????? ?????? ?????????????????? ?????? ????????? ?????? object??? cp?????? ?????????.
    }
    cp.push(answerObject);
    setAnswerArray(cp);
    if (index < questionArray.length - 1)
      cardRef.scrollToIndex({
        animated: true,
        index: index + 1,
        viewPosition: 0.5,
      });
  };

  const handleInputText = (input, index) => {
    console.log(input, index);
    let cp = [...answerArray];
    const answerObject = {
      question: questionArray[index].content,
      answer: input,
    };
    const filteredAnswer = cp.filter(
      qa => qa.question !== questionArray[index].content,
    );
    if (filteredAnswer.length < cp.length) {
      cp = [...filteredAnswer];
    }
    cp.push(answerObject);
    setAnswerArray(cp);
    if (index < questionArray.length - 1)
      cardRef.scrollToIndex({
        animated: true,
        index: index + 1,
        viewPosition: 0.5,
      });
  };

  const handleCreatePost = () => {
    setIsPostSubmitted(true);
    const postObject = {
      groupId: groupId,
      meetingId: meetingId,
      userId: userId,
      questionAnswers: answerArray,
    };
    dispatch(createPost(postObject))
      .unwrap()
      .then(res => {
        console.log(res);
        setFlowerId(res.meeting.flowerId);
        setIsPostSubmitted(false);
        console.log(JSON.stringify(photoData));
        dispatch(uploadPostImage({postId: res.post.id, photoData: photoData}))
          .unwrap()
          .then(res => {
            console.log(res);
          })
          .catch(err => console.log(err));
        setPhotoData(null);
        cardRef.scrollToIndex({
          index: questionArray.length - 1,
          viewPosition: 0.5,
        });
      })
      .catch(err => {
        console.log(err);
        setIsPostSubmitted(false);
      });
  };

  const onSwipeRight = index => {
    setGoNext(true);
    if (index > 0)
      cardRef.scrollToIndex({
        index: index - 1,
        viewPosition: 0.5,
      });
  };

  const onSwipeLeft = index => {
    if (index < questionArray.length - 1) {
      const filteredAnswer = answerArray.filter(
        qa => qa.question === questionArray[index + 1].content,
      );
      // ????????? ?????? object??? ?????????.
      if (filteredAnswer.length === 0) {
        // ?????? ?????? ??????, ??? ?????? ????????? ??? ??? ??????
        setGoNext(false);
        // ???????????? ??? ?????? ??????.
      }
      if (goNext)
        cardRef.scrollToIndex({
          index: index + 1,
          viewPosition: 0.5,
        });
    }
  };

  const [imageOptions, setImageOptions] = useState({
    // saveToPhotos: true,
    mediaType: 'photo',
    includeBase64: false,
    quality: 1,
    selectionLimit: 0,
  });

  const handleChooseImage = (type, options) => {
    if (type === 'capture') {
      launchCamera(options, photos => {
        const data = new FormData();
        data.append('post', {
          name: photos.assets[0].fileName,
          type: photos.assets[0].type,
          uri: photos.assets[0].uri,
        });
        setPhotoUri(photos.assets[0].uri);
        setPhotoData(data);

        // fetch(`${API_URL}/posts/1/images`, {
        //   method: 'post',
        //   body: photoData,
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // })
        //   .then(response => {
        //     console.log('response', response.data);
        //   })
        //   .catch(error => {
        //     console.log('error', error);
        //   });
      });
    }
    // else {
    //   launchImageLibrary(options, photos => {
    //     const data = new FormData();
    //     if (photos.assets.length > 0) {
    //       const imageArray = photos.assets?.map(val => {
    //         return {
    //           name: val.fileName,
    //           type: val.type,
    //           uri: val.uri,
    //         };
    //       });

    //       console.log(JSON.stringify(imageArray));

    //       data.append('post', imageArray);

    //       console.log(JSON.stringify(data));

    //       fetch(`${API_URL}/posts/${postId}/image`, {
    //         method: 'post',
    //         body: data,
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       })
    //         .then(response => {
    //           console.log('response', response.data);
    //         })
    //         .catch(error => {
    //           console.log('error', error);
    //         });
    //     }
    //   });
    // }
  };

  const Greetings = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          height: '80%',
          width: width * 0.9,
          marginLeft: 16,
          marginRight: 8,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={VisualDesign}
            style={{width: 33, height: 38}}
            resizeMode="contain"
          />
          <View
            style={{
              width: 1,
              height: 30,
              backgroundColor: '#fff',
              marginHorizontal: 11,
            }}
          />
          <Image
            source={EwhaLogo}
            style={{width: 33, height: 38}}
            resizeMode="contain"
          />
        </View>
        <View style={{marginTop: 20}}>
          <Heading3>?????? ???????????????</Heading3>
          <Heading3>2022 ????????????????????? ??????????????????</Heading3>
          <Heading3>???????????? ???????????????.</Heading3>
        </View>
        <View style={{marginTop: 16}}>
          <Body3>??? ????????? Buzzy ??? ????????? ???????????? ????????? ????????? ???</Body3>
          <Body3>????????? ?????? ?????????????????????. 6??? 21????????? 26?????????, 6</Body3>
          <Body3>????????? ???????????????. ?????? ????????? Buzzy??? ???????????? ???</Body3>
          <Body3>?????? ????????? ?????? ????????? ???????????????. ???????????????.</Body3>
        </View>
        <Button
          title="?????? ????????????"
          style={{marginTop: '50%', width: '50%', bottom: 0}}
          onPress={() =>
            cardRef.scrollToIndex({
              animated: true,
              index: 0,
              viewPosition: 0.5,
            })
          }
        />
      </View>
    );
  };

  const questionCardLayout = ({item, index}) => {
    if (index === questionArray.length - 1) {
      return (
        <View
          style={{
            width: width * 0.85,
            height: '62%',
            backgroundColor: '#202225',
            marginTop: '20%',
            marginLeft: width * 0.023,
            marginRight: width * 0.046,
            padding: 12,
            borderRadius: 20,
            alignItems: 'center',
          }}>
          <Heading4 style={{marginTop: 74}}>
            ?????? ????????? ?????????????????????!
          </Heading4>
          <Heading4>????????? ?????? ????????? ???????????????.</Heading4>
          <Heading4> </Heading4>
          <Heading4>?????? ?????? ???????????????</Heading4>
          <Heading4>[{groupInfo.name}] ????????????</Heading4>
          <Heading4>???????????? ????????????????</Heading4>
          <Image
            source={postFlowerImagePath[flowerId]}
            style={{width: 70, height: 70, marginTop: '20%'}}
            resizeMode="contain"
          />
          <Button
            title="???????????? ??????"
            style={{
              width: width * 0.75,
              height: '25%',
              borderRadius: 8,
              marginTop: '20%',
            }}
            onPress={() => {
              navigation.reset({
                routes: [
                  {
                    name: 'GardenTabs',
                    params: groupInfo,
                  },
                ],
              });
            }}
          />
        </View>
      );
    }
    return (
      <GestureRecognizer
        onSwipeRight={() => onSwipeRight(index)}
        onSwipeLeft={() => onSwipeLeft(index)}
        style={{
          width: width * 0.85,
          height: '62%',
          backgroundColor: backgroundColors[index],
          marginTop: '20%',
          marginHorizontal: width * 0.023,
          padding: 12,
          paddingTop: 26,
          borderRadius: 20,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Body3 style={{color: '#000'}}>
            {index + 1}/{questionArray.length - 1}
          </Body3>
          {(index === 3 || index === 4) && (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (index < questionArray.length - 1)
                    cardRef.scrollToIndex({
                      animated: true,
                      index: index + 1,
                      viewPosition: 0.5,
                    });
                }}>
                <Heading5 style={{color: '#000'}}>SKIP {'>'}</Heading5>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Heading2
          style={{
            color: '#000',
            marginTop: 16,
          }}>
          {item.content}
        </Heading2>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: `rgba(0,0,0,0.2)`,
              marginTop: 20,
            }}
          />
        </View>
        <View style={{alignItems: 'center', marginTop: 16}}>
          {Object.keys(item.options).length > 0 ? (
            optionsId.map(val => {
              const chosenQuestion = answerArray.filter(
                qa => qa.question === item.content,
              );
              const selected =
                chosenQuestion.length > 0 &&
                item.options[val] === chosenQuestion[0].answer;

              return (
                <TouchableOpacity
                  key={item.options[val]}
                  style={{
                    width: '100%',
                    backgroundColor: selected ? '#fff' : '#111214',
                    marginTop: '4%',
                    justifyContent: 'center',
                    borderRadius: 8,
                    padding: 14,
                  }}
                  onPress={() => handleSelectOption(index, val)}>
                  {selected ? (
                    <Heading5 style={{color: '#111214'}}>
                      {item.options[val]}
                    </Heading5>
                  ) : (
                    <Body3>{item.options[val]}</Body3>
                  )}
                </TouchableOpacity>
              );
            })
          ) : index !== questionArray.length - 2 ? (
            <TextInput
              placeholder={
                index === 3
                  ? 'Buzzy??? ?????????????????? ?????? ????????? ????????? ???\n????????????. Buzzy ??????????????? ??? ????????? ?????????\n?????? ?????????!'
                  : '????????? ????????? ?????? ???????????????. ??(????????????????????)??? Buzzy ?????????????????? ????????? ???????????? ?????????\n??????.'
              }
              placeholderTextColor="#474c52"
              onEndEditing={val => handleInputText(val.nativeEvent.text, index)}
              style={{
                width: '100%',
                height: '70%',
                backgroundColor: `rgba(255,255,255,0.3)`,
                marginTop: '4%',
                borderRadius: 8,
                paddingVertical: 12,
                paddingHorizontal: 16,
                color: '#000',
                fontFamily: 'SUIT-Regular',
              }}
              multiline
              blurOnSubmit
              textAlignVertical="top"
              onSubmitEditing={() => {
                if (index < questionArray.length - 1)
                  cardRef.scrollToIndex({
                    animated: true,
                    index: index + 1,
                    viewPosition: 0.5,
                  });
              }}
            />
          ) : photoUri ? (
            <Image
              source={{uri: photoUri}}
              style={{
                width: '100%',
                height: '70%',
                marginTop: '4%',
                borderRadius: 8,
              }}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity
              style={{
                width: '100%',
                height: '70%',
                backgroundColor: '#18191b',
                marginTop: '4%',
                borderRadius: 8,
                padding: 14,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.6}
              onPress={() => handleChooseImage('capture', imageOptions)}>
              <Image
                source={Capture}
                style={{width: 48, height: 48}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {index === 5 && (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#3a3e44',
                height: 48,
                width: 140,
                marginTop: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 24,
              }}
              disabled={isPostSubmitted}
              onPress={handleCreatePost}>
              <Heading5>????????????</Heading5>
            </TouchableOpacity>
          </View>
        )}
      </GestureRecognizer>
    );
  };

  // const SubmitCardLayout = () => {
  //   return (
  //     <GestureRecognizer
  //       onSwipeRight={() => {
  //         cardRef.scrollToIndex({
  //           index: 8,
  //           viewPosition: 0.5,
  //         });
  //       }}
  //       style={{
  //         // width: width * 0.85,
  //         // height: '80%',
  //         backgroundColor: '#c6b8f5',
  //         // marginTop: '15%',
  //         marginHorizontal: width * 0.023,
  //         padding: 12,
  //         paddingTop: 26,
  //         borderRadius: 20,
  //       }}>
  //       <Body3 style={{color: '#000'}}>10/10</Body3>
  //       <Heading2
  //         style={{
  //           color: '#000',
  //           // width: 0.7 * width,
  //           // height: 0.1 * height,
  //           marginTop: 16,
  //         }}>
  //         ????????? ?????? ???????????? ????????? ?????????.
  //       </Heading2>
  //       <View style={{alignItems: 'center'}}>
  //         <TouchableOpacity
  //           style={{
  //             // width: '100%',
  //             // height: '63%',
  //             backgroundColor: '#000',
  //             // marginTop: '4%',
  //             borderRadius: 8,
  //             padding: 14,
  //           }}></TouchableOpacity>
  //       </View>
  //     </GestureRecognizer>
  //   );
  // };

  return (
    <MainWrapper>
      <ScreenHeader
        title={`???????????????????????? ??????`}
        navigation={navigation}
        style={{margin: 16, marginBottom: 0}}
      />
      <View
        style={{
          top: 40,
          height: '100%',
          alignItems: 'center',
        }}>
        {questionArray.length > 0 && (
          <FlatList
            ListHeaderComponent={Greetings}
            data={questionArray}
            ref={ref => {
              setCardRef(ref);
            }}
            renderItem={questionCardLayout}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            scrollEnabled={false}
          />
        )}
      </View>
    </MainWrapper>
  );
};

export default PostScreen;
