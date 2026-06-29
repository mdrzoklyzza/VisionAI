import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { analyzeImage, PROMPTS } from '../lib/gemini';

export default function ResultScreen() {
  const { base64Image, promptKey } = useLocalSearchParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const typeConfig = {
    academic: { label: 'Academic Analysis', color: '#3B82F6', bg: '#1e3a5f', border: '#3B82F6' },
    safety:   { label: 'Safety Analysis',   color: '#F59E0B', bg: '#3d2c00', border: '#F59E0B' },
    inventory:{ label: 'Inventory Analysis', color: '#0891B2', bg: '#0c2d38', border: '#0891B2' },
  };
  const config = typeConfig[promptKey] || typeConfig.academic;

  useEffect(() => {
    async function analyze() {
      try {
        console.log('[ResultScreen] promptKey:', promptKey);
        console.log('[ResultScreen] base64Image length:', base64Image?.length);

        if (!base64Image || base64Image.length === 0) {
          throw new Error('No image data received.');
        }

        const prompt = PROMPTS[promptKey] || PROMPTS.academic;
        const response = await analyzeImage(base64Image, prompt);

        console.log('[ResultScreen] Gemini response:', JSON.stringify(response, null, 2));

        if (response.error) {
          throw new Error(`Gemini error: ${response.error.message}`);
        }

        if (!response.candidates || response.candidates.length === 0) {
          throw new Error('Gemini returned no candidates. Check your API key or quota.');
        }

        const text = response.candidates[0].content.parts[0].text;
        console.log('[ResultScreen] Raw text:', text);

        // Strip thinking tags (Gemini 2.5 Flash quirk) + markdown fences
        const stripped = text
          .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        const jsonMatch = stripped.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error('Could not find JSON in Gemini response.');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Fallback para hindi empty ang kahit anong field
        const safe = {
          objects: parsed.objects?.length ? parsed.objects : ['No objects identified'],
          context: parsed.context || 'No context available.',
          activities: parsed.activities || 'No activities identified.',
          recommendations: parsed.recommendations || 'No recommendations available.',
        };

        setResult(safe);
      } catch (err) {
        console.error('[ResultScreen] Error:', err);
        setError(err.message || 'Failed to analyze image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    analyze();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={config.color} />
        <Text style={styles.loadingText}>Analyzing image...</Text>
        <Text style={styles.loadingSub}>This may take a moment</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sections = [
    {
      label: 'Objects Detected',
      value: Array.isArray(result.objects)
        ? result.objects.join('\n• ')
        : result.objects,
    },
    { label: 'Context',         value: result.context },
    { label: 'Activities',      value: result.activities },
    { label: 'Recommendations', value: result.recommendations },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { borderBottomColor: config.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Text style={styles.headerBackText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: config.color }]}>{config.label}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {sections.map((section, i) => (
          <View key={i} style={[styles.card, { borderLeftColor: config.color }]}>
            <Text style={[styles.cardLabel, { color: config.color }]}>{section.label}</Text>
            <Text style={styles.cardText}>
              {section.label === 'Objects Detected' ? `• ${section.value}` : section.value}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: config.bg, borderColor: config.border }]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.actionBtnText}>📷 Take Another Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F0F0F' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerBack: { marginRight: 16 },
  headerBackText: { color: '#aaa', fontSize: 16 },
  headerTitle: { fontSize: 17, fontWeight: '700' },

  container: { flex: 1 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },

  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 3,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardText: { fontSize: 15, color: '#ccc', lineHeight: 22 },

  actionBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0F0F0F',
  },
  loadingText: { marginTop: 16, fontSize: 16, color: '#fff', fontWeight: '600' },
  loadingSub: { marginTop: 6, fontSize: 13, color: '#666' },

  errorTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
  errorText: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  backBtn: { backgroundColor: '#1A1A1A', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10 },
  backBtnText: { color: '#fff', fontWeight: '600' },
});