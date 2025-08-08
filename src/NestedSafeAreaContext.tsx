import { createContext, useContext } from 'react';
import type { EdgeInsets } from 'react-native-safe-area-context';

export type NestedSafeAreaInsets = EdgeInsets;

export interface NestedSafeAreaContextValue {
  insets: NestedSafeAreaInsets;
  consumeInsets: (consumed: Partial<EdgeInsets>) => void;
}

export const NestedSafeAreaContext =
  createContext<NestedSafeAreaContextValue | null>(null);

export const useNestedSafeAreaContext = (): NestedSafeAreaContextValue => {
  const context = useContext(NestedSafeAreaContext);
  if (!context) {
    throw new Error(
      'useNestedSafeAreaContext must be used within a NestedSafeAreaProvider'
    );
  }
  return context;
};
