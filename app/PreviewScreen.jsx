import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() => router.push({ pathname: '/Result', params: { photoUri } })}
        >
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1, resizeMode: 'contain' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  retakeButton: { backgroundColor: '#5A6472', padding: 14, borderRadius: 8 },
  analyzeButton: { backgroundColor: '#5B3FA3', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});