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
  /**
   * List of edges to reset to the original safe area insets.
   * Takes precedence over both consumedInsets and consumedEdges.
   * @example ['top', 'bottom'] // Resets top and bottom to original safe area values
   */
  resetEdges?: Edge[];
}

export const NestedSafeAreaProvider: React.FC<NestedSafeAreaProviderProps> = ({
  children,
  consumedInsets,
  consumedEdges,
  resetEdges,
}) => {
  const originalInsets = useSafeAreaInsets();
  const parentContext = useContext(NestedSafeAreaContext);
  const parentInsets = parentContext ? parentContext.insets : originalInsets;

  const finalConsumedInsets = useMemo(() => {
    const insets = {
      top: consumedInsets?.top || 0,
      right: consumedInsets?.right || 0,
      bottom: consumedInsets?.bottom || 0,
      left: consumedInsets?.left || 0,
    };

    if (consumedEdges && consumedEdges.length > 0) {
      consumedEdges.forEach((edge) => {
        insets[edge] = parentInsets[edge];
      });
    }

    return insets;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumedEdges?.join(), JSON.stringify(consumedInsets), parentInsets]);

  const currentInsets: NestedSafeAreaInsets = useMemo(() => {
    const insets = {
      top: Math.max(0, parentInsets.top - (finalConsumedInsets.top || 0)),
      right: Math.max(0, parentInsets.right - (finalConsumedInsets.right || 0)),
      bottom: Math.max(
        0,
        parentInsets.bottom - (finalConsumedInsets.bottom || 0)
      ),
      left: Math.max(0, parentInsets.left - (finalConsumedInsets.left || 0)),
    };

    // Apply resetEdges - reset specified edges to original safe area values
    if (resetEdges && resetEdges.length > 0) {
      resetEdges.forEach((edge) => {
        insets[edge] = originalInsets[edge];
      });
    }

    return insets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentInsets, finalConsumedInsets, resetEdges?.join(), originalInsets]);

  const consumeInsets = useCallback(
    (consumed: Partial<EdgeInsets>) => {
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
