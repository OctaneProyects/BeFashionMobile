import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import ImageEditor from '@react-native-community/image-editor';
class CameraScreen extends React.Component {
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
            title: 'Permiso para usar cámara',
            message: 'Es necesario el permiso para usar la cámara',
            buttonPositive: 'Permitir',
            buttonNegative: 'Cancelar',
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
    const {uri, width, height} = data;
    console.log('data');
    console.log(data);

    cropData = {
      offset: {x: 0, y: 0},
      size: {width: 1024, height: 768},
      displaySize: {width: 1024, height: 768},
      resizeMode: 'contain',
    };

    if (data) {
      await camera.pausePreview();
      ImageEditor.cropImage(uri, cropData).then((url) => {
        (data.width = 1024), (data.height = 760);
        console.log('data', data);
        console.log('Cropped image uri', url);
      });
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

export default CameraScreen;
