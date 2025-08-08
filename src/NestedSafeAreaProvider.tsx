import React, { useContext, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { NestedSafeAreaContext } from './NestedSafeAreaContext';
import type {
  NestedSafeAreaContextValue,
  NestedSafeAreaInsets,
} from './NestedSafeAreaContext';

export interface NestedSafeAreaProviderProps {
  children: React.ReactNode;
  consumedInsets?: Partial<EdgeInsets>;
}

export const NestedSafeAreaProvider: React.FC<NestedSafeAreaProviderProps> = ({
  children,
  consumedInsets = { top: 0, right: 0, bottom: 0, left: 0 },
}) => {
  const originalInsets = useSafeAreaInsets();
  const parentContext = useContext(NestedSafeAreaContext);

  const baseInsets = parentContext ? parentContext.insets : originalInsets;

  const currentInsets: NestedSafeAreaInsets = useMemo(
    () => ({
      top: Math.max(0, baseInsets.top - (consumedInsets.top || 0)),
      right: Math.max(0, baseInsets.right - (consumedInsets.right || 0)),
      bottom: Math.max(0, baseInsets.bottom - (consumedInsets.bottom || 0)),
      left: Math.max(0, baseInsets.left - (consumedInsets.left || 0)),
    }),
    [baseInsets, consumedInsets]
  );

  const consumeInsets = useCallback(
    (consumed: Partial<typeof consumedInsets>) => {
      return {
        top: Math.max(0, currentInsets.top - (consumed.top || 0)),
        right: Math.max(0, currentInsets.right - (consumed.right || 0)),
        bottom: Math.max(0, currentInsets.bottom - (consumed.bottom || 0)),
        left: Math.max(0, currentInsets.left - (consumed.left || 0)),
      };
    },
    [currentInsets]
  );

  const contextValue: NestedSafeAreaContextValue = useMemo(
    () => ({
      insets: currentInsets,
      consumeInsets,
    }),
    [currentInsets, consumeInsets]
  );

  return (
    <NestedSafeAreaContext.Provider value={contextValue}>
      {children}
    </NestedSafeAreaContext.Provider>
  );
};
