import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NestedSafeAreaProvider,
  NestedSafeAreaView,
  useNestedSafeAreaInsets,
} from '@fullstackhouse/react-native-nested-safe-area';

const InsetDisplay: React.FC<{ label: string }> = ({ label }) => {
  const insets = useNestedSafeAreaInsets();

  return (
    <View style={styles.insetDisplay}>
      <Text style={styles.insetLabel}>{label}</Text>
      <Text style={styles.insetText}>
        Top: {insets.top}, Right: {insets.right}, Bottom: {insets.bottom}, Left:{' '}
        {insets.left}
      </Text>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NestedSafeAreaProvider>
        <View style={styles.container}>
          <InsetDisplay label="Root Level" />

          <NestedSafeAreaView
            style={styles.section}
            edges={['top', 'left', 'right']}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Header Section</Text>
              <InsetDisplay label="Inside Header" />

              <NestedSafeAreaView style={styles.innerSection} edges={['top']}>
                <Text style={styles.sectionTitle}>Nested Section</Text>
                <InsetDisplay label="Deeply Nested" />

                <NestedSafeAreaView
                  style={styles.innerSection}
                  edges={['left', 'right']}
                >
                  <Text style={styles.sectionTitle}>Triple Nested</Text>
                  <InsetDisplay label="Triple Nested" />
                </NestedSafeAreaView>
              </NestedSafeAreaView>
            </View>
          </NestedSafeAreaView>

          <View style={styles.spacer} />

          <NestedSafeAreaView
            style={styles.section}
            edges={['bottom', 'left', 'right']}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>Footer Section</Text>
              <InsetDisplay label="Inside Footer" />
            </View>
          </NestedSafeAreaView>
        </View>
      </NestedSafeAreaProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  section: {
    backgroundColor: '#e0e0e0',
    margin: 10,
    borderRadius: 8,
  },
  sectionContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  innerSection: {
    backgroundColor: '#d0d0d0',
    marginTop: 10,
    borderRadius: 4,
  },
  insetDisplay: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  insetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  insetText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
  spacer: {
    flex: 1,
  },
});

export default App;
