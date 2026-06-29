import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen() {
  const params = useLocalSearchParams();
  const photoUri = Array.isArray(params.photoUri)
    ? params.photoUri[0]
    : params.photoUri;

  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleAnalyze() {
    if (!photoUri) {
      console.log('No photo URI available');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Analyze button pressed');
      const base64Image = await imageToBase64(photoUri);
      console.log('Base64 length:', base64Image.length);

      router.push({
        pathname: '/Result',
        params: { base64Image },
      });
    } catch (error) {
      console.error('Failed to analyze image:', error);
      // optional: show a Toast/Alert here for the user
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : (
        <View style={styles.preview}>
          <Text style={styles.errorText}>No photo to preview</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
          disabled={isAnalyzing}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analyzeButton, isAnalyzing && styles.disabledButton]}
          onPress={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Analyze</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { color: '#fff', fontSize: 16 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  retakeButton: {
    backgroundColor: '#5A6472',
    padding: 14,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  analyzeButton: {
    backgroundColor: '#5B3FA3',
    padding: 14,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});