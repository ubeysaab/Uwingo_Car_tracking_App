import LucideIconButton from '@/components/IconButton/LucideIconButton';
import ErrorModal from '@/components/Modals/ErrorModal';
import SuccessModal from '@/components/Modals/SuccessModal';
import { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Asset, CameraOptions, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false)

  const [errorModalVisibility, setErrorModalVisibility] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successModalVisibility, setSuccessModalVisibility] = useState(false)
  const { t } = useTranslation()


  function onClose() {
    setErrorModalVisibility(false)
  }

  function onCloseSuc() {
    setSuccessModalVisibility(false)
  }


  const options: CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    saveToPhotos: true, // Saves camera capture to gallery
  } as const;

  const handleResponse = (result: ImagePickerResponse) => {
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage);

    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri || null);
      uploadImage(asset);
    }
  };


  const uploadImage = async (asset: Asset) => {
    const formData = new FormData();

    // Crucial for React Native: The object must have uri, type, and name
    const fileToUpload = {
      uri: Platform.OS === 'android' ? asset.uri : asset.uri?.replace('file://', ''),
      type: asset.type || 'image/jpeg',
      name: asset.fileName || 'upload.jpg',
    };
    // @ts-ignore - FormData expects a string/blob, but RN uses this object format
    formData.append('image', fileToUpload);

    try {
      setUploading(true);
      // todo : add frontEnd endpoint here 
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      // todo : success Modal
      // Alert.alert('Success', 'Image uploaded!');
      setSuccessModalVisibility(true)





    } catch (error) {
      setErrorMessage('Upload Failed, Check your network or server.')
      setErrorModalVisibility(true)

    } finally {
      setUploading(false);
    }



  }




  return (
    <View style={styles.container}>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

      {/* <View style={styles.buttonContainer}> */}
      <LucideIconButton text={t('common.takePhoto')} icon='Camera' onPress={() => launchCamera(options, handleResponse)} />
      <LucideIconButton text={t('common.chooseFrmGallery')} icon='ImagePlus' onPress={() => launchImageLibrary(options, handleResponse)} />
      {/* </View> */}

      <ErrorModal

        visible={errorModalVisibility}
        message={errorMessage}
        onClose={onClose}
      />


      <SuccessModal
        visible={successModalVisibility}
        onClose={onCloseSuc}
        message='Image uploaded!'


      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 15 },
  image: { width: 200, height: 200, marginBottom: 20, borderRadius: 10 },
  buttonContainer: { gap: 10 }
});

export default ImageUploader;

