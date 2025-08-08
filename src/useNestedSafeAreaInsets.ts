import { useNestedSafeAreaContext } from './NestedSafeAreaContext';
import type { NestedSafeAreaInsets } from './NestedSafeAreaContext';

export const useNestedSafeAreaInsets = (): NestedSafeAreaInsets => {
  const context = useNestedSafeAreaContext();
  return context.insets;
};
