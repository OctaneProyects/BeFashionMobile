import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';

class PictureScreen extends React.Component {
  state = {
    pausePreview: false,
    uri: '',
    base64: '',
  };

  render() {
    // Get it from props
    const {navigation} = this.props;
    const {pausePreview} = this.state;
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status}) => {
            // if (status !== 'READY') return <PendingView />;
            return (
              <View
                style={{
                  borderColor: 'blue',
                  flex: 1,
                  justifyContent: 'flex-end',
                }}>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    flex: 1,
                    height: '35%',
                    width: '100%',
                  }}></View>
                <View
                  style={{
                    height: '35%',
                    width: '100%',
                    borderColor: 'white',
                    borderWidth: 1,
                    flex: 1.5,
                  }}></View>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    flex: 1,
                    height: '35%',
                    width: '100%',
                  }}></View>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                  }}>
                  {pausePreview ? (
                    <TouchableOpacity
                      style={styles.button}
                      // onPress={(() => this.resumePicture(camera))}
                      onPress={() =>
                        this.props.navigation.navigate({
                          name: this.props.route.params.screen,
                          params: {
                            uri: this.state.uri,
                            base64: this.state.base64,
                          },
                          merge: true,
                        })
                      }>
                      <Text>Aceptar</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.takePicture(camera)}
                      style={styles.button}>
                      <Text style={{fontSize: 14}}> Capturar </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }
  takePicture = async function (camera) {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    const source = data.uri;
    if (source) {
      await camera.pausePreview();
      console.log('picture source', source);
      console.log('picture data', data);
      this.setState({pausePreview: true});
      this.setState({uri: data.uri});
      this.setState({base64: data.base64});
    }
  };

  resumePicture = async function (camera) {
    await camera.resumePreview();
    this.setState({pausePreview: false});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default PictureScreen;
