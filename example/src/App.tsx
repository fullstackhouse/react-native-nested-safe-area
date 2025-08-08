import { Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NestedSafeAreaProvider, NestedSafeAreaView } from '../../src';

export default function App() {
  return (
    <SafeAreaProvider>
      <NestedSafeAreaProvider>
        <NestedSafeAreaView style={styles.container}>
          <Text style={styles.text}>Outer Safe Area</Text>
          <NestedSafeAreaView edges={['top']} style={styles.inner}>
            <Text style={styles.text}>Inner Safe Area (top only)</Text>
            <NestedSafeAreaView edges={['bottom']} style={styles.innermost}>
              <Text style={styles.text}>Innermost Safe Area (bottom only)</Text>
            </NestedSafeAreaView>
          </NestedSafeAreaView>
        </NestedSafeAreaView>
      </NestedSafeAreaProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  inner: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    margin: 20,
  },
  innermost: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    margin: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
});
