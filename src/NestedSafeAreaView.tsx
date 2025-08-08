import React, { useMemo } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { NestedSafeAreaProvider } from './NestedSafeAreaProvider';
import { useNestedSafeAreaInsets } from './useNestedSafeAreaInsets';

export interface NestedSafeAreaViewProps
  extends Omit<React.ComponentProps<typeof View>, 'children'> {
  children: React.ReactNode;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

const InnerNestedSafeAreaView: React.FC<
  Omit<NestedSafeAreaViewProps, 'children'> & { children: React.ReactNode }
> = ({
  children,
  edges = ['top', 'right', 'bottom', 'left'],
  style,
  ...restProps
}) => {
  const insets = useNestedSafeAreaInsets();

  const paddingStyle: ViewStyle = useMemo(() => {
    const padding: ViewStyle = {};

    if (edges.includes('top')) {
      padding.paddingTop = insets.top;
    }
    if (edges.includes('right')) {
      padding.paddingRight = insets.right;
    }
    if (edges.includes('bottom')) {
      padding.paddingBottom = insets.bottom;
    }
    if (edges.includes('left')) {
      padding.paddingLeft = insets.left;
    }

    return padding;
  }, [insets, edges]);

  const consumedInsets = useMemo(() => {
    const consumed = { top: 0, right: 0, bottom: 0, left: 0 };

    if (edges.includes('top')) {
      consumed.top = insets.top;
    }
    if (edges.includes('right')) {
      consumed.right = insets.right;
    }
    if (edges.includes('bottom')) {
      consumed.bottom = insets.bottom;
    }
    if (edges.includes('left')) {
      consumed.left = insets.left;
    }

    return consumed;
  }, [insets, edges]);

  return (
    <View style={[paddingStyle, style]} {...restProps}>
      <NestedSafeAreaProvider consumedInsets={consumedInsets}>
        {children}
      </NestedSafeAreaProvider>
    </View>
  );
};

export const NestedSafeAreaView: React.FC<NestedSafeAreaViewProps> = (
  props
) => {
  return <InnerNestedSafeAreaView {...props} />;
};
