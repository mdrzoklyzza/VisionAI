import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { imageToBase64 } from '../lib/gemini';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams();
  const router = useRouter();

  async function handleAnalyze(promptKey) {
    const base64Image = await imageToBase64(photoUri);
    router.push({ pathname: '/ResultScreen', params: { base64Image, promptKey } });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />
      
      <View style={styles.bottomPanel}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => router.back()}>
          <Text style={styles.retakeText}>↩ Retake</Text>
        </TouchableOpacity>

        <Text style={styles.chooseText}>Choose Analysis Type</Text>

        <View style={styles.analyzeRow}>
          <TouchableOpacity style={styles.academicButton} onPress={() => handleAnalyze('academic')}>
            <Text style={styles.emoji}>🎓</Text>
            <Text style={styles.buttonLabel}>Academic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.safetyButton} onPress={() => handleAnalyze('safety')}>
            <Text style={styles.emoji}>🛡️</Text>
            <Text style={styles.buttonLabel}>Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inventoryButton} onPress={() => handleAnalyze('inventory')}>
            <Text style={styles.emoji}>📦</Text>
            <Text style={styles.buttonLabel}>Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  preview: { flex: 1 },
  bottomPanel: {
    backgroundColor: '#1a1a2e',
    paddingTop: 16,
    paddingBottom: 36,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  retakeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ffffff40',
  },
  retakeText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  chooseText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  analyzeRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  academicButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  safetyButton: {
    flex: 1,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  inventoryButton: {
    flex: 1,
    backgroundColor: '#0891B2',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  emoji: { fontSize: 22, marginBottom: 4 },
  buttonLabel: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});