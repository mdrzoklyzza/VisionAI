import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router'; // ✅ import
import { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const router = useRouter(); // ✅ hook call — must be inside the component
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    console.log("takePicture called");
    if (!cameraRef.current) {
      console.log("cameraRef is null");
      return;
    }
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      console.log("Captured photo URI:", result.uri);
      router.push({
        pathname: '/PreviewScreen',
        params: { photoUri: result.uri },
      });
    } catch (err) {
      console.log("takePictureAsync error:", err);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <TouchableOpacity
        style={styles.captureButton}
        onPress={() => {
          console.log("Button pressed!");
          takePicture();
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.captureButtonText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#ba1212',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    zIndex: 10,
    elevation: 10,
  },
  captureButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#ba1212',
    padding: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});