import React, { useContext, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EdgeInsets } from 'react-native-safe-area-context';

/**
 * Represents a safe area edge that can be consumed
 */
export type Edge = 'top' | 'right' | 'bottom' | 'left';
import { NestedSafeAreaContext } from './NestedSafeAreaContext';
import type {
  NestedSafeAreaContextValue,
  NestedSafeAreaInsets,
} from './NestedSafeAreaContext';

export interface NestedSafeAreaProviderProps {
  children: React.ReactNode;
  /**
   * Partial insets to subtract from the parent context.
   * Each specified edge value will be subtracted from the corresponding parent inset.
   * @example { top: 20, bottom: 10 } // Subtracts 20 from top and 10 from bottom
   */
  consumedInsets?: Partial<EdgeInsets>;
  /**
   * List of edges to completely consume (set to zero in nested contexts).
   * Takes precedence over consumedInsets when both are provided.
   * @example ['top', 'bottom'] // Completely consumes top and bottom edges
   */
  consumedEdges?: Edge[];
}

export const NestedSafeAreaProvider: React.FC<NestedSafeAreaProviderProps> = ({
  children,
  consumedInsets = { top: 0, right: 0, bottom: 0, left: 0 },
  consumedEdges,
}) => {
  const originalInsets = useSafeAreaInsets();
  const parentContext = useContext(NestedSafeAreaContext);

  const baseInsets = parentContext ? parentContext.insets : originalInsets;

  // Convert consumedEdges to consumedInsets
  const edgeBasedConsumedInsets = useMemo(() => {
    if (!consumedEdges || consumedEdges.length === 0) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }

    const insets = { top: 0, right: 0, bottom: 0, left: 0 };
    consumedEdges.forEach((edge) => {
      insets[edge] = baseInsets[edge];
    });

    return insets;
  }, [consumedEdges, baseInsets]);

  // Use consumedEdges if provided, otherwise fall back to consumedInsets
  const finalConsumedInsets = consumedEdges
    ? edgeBasedConsumedInsets
    : consumedInsets;

  const currentInsets: NestedSafeAreaInsets = useMemo(
    () => ({
      top: Math.max(0, baseInsets.top - (finalConsumedInsets.top || 0)),
      right: Math.max(0, baseInsets.right - (finalConsumedInsets.right || 0)),
      bottom: Math.max(
        0,
        baseInsets.bottom - (finalConsumedInsets.bottom || 0)
      ),
      left: Math.max(0, baseInsets.left - (finalConsumedInsets.left || 0)),
    }),
    [baseInsets, finalConsumedInsets]
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
