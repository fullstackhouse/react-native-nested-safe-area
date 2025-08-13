import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NestedSafeAreaProvider,
  NestedSafeAreaView,
  useNestedSafeAreaInsets,
  useNestedSafeAreaContext,
} from '../index';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: jest.fn(({ children }) => children),
  SafeAreaContext: {
    Consumer: jest.fn(({ children }) =>
      children({ top: 44, right: 0, bottom: 34, left: 0 })
    ),
  },
  useSafeAreaInsets: jest.fn(),
}));

const mockUseSafeAreaInsets = (
  jest.requireMock('react-native-safe-area-context') as any
).useSafeAreaInsets;

const TestComponent: React.FC = () => {
  const insets = useNestedSafeAreaInsets();

  return (
    <View>
      <Text testID="insets-top">{insets.top}</Text>
      <Text testID="insets-right">{insets.right}</Text>
      <Text testID="insets-bottom">{insets.bottom}</Text>
      <Text testID="insets-left">{insets.left}</Text>
    </View>
  );
};

describe('NestedSafeArea', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSafeAreaInsets.mockReturnValue({
      top: 44,
      right: 0,
      bottom: 34,
      left: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('NestedSafeAreaProvider', () => {
    it('should provide insets from SafeAreaProvider when no parent context exists', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      expect(screen.getByTestId('insets-top')).toHaveTextContent('44');
      expect(screen.getByTestId('insets-right')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('34');
      expect(screen.getByTestId('insets-left')).toHaveTextContent('0');
    });

    it('should consume insets correctly', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedInsets={{ top: 20, bottom: 10 }}>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      expect(screen.getByTestId('insets-top')).toHaveTextContent('24'); // 44 - 20
      expect(screen.getByTestId('insets-right')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('24'); // 34 - 10
      expect(screen.getByTestId('insets-left')).toHaveTextContent('0');
    });

    it('should handle nested providers correctly', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedInsets={{ top: 20 }}>
            <NestedSafeAreaProvider consumedInsets={{ top: 10 }}>
              <TestComponent />
            </NestedSafeAreaProvider>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // First provider: 44 - 20 = 24
      // Second provider: 24 - 10 = 14
      expect(screen.getByTestId('insets-top')).toHaveTextContent('14');
    });

    it('should not allow negative insets', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedInsets={{ top: 100, bottom: 100 }}>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      expect(screen.getByTestId('insets-top')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('0');
    });

    it('should consume edges completely when using consumedEdges', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedEdges={['top', 'bottom']}>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Top and bottom edges should be completely consumed (set to 0)
      expect(screen.getByTestId('insets-top')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-right')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-left')).toHaveTextContent('0');
    });

    it('should consume only specified edges when using consumedEdges', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedEdges={['top']}>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Only top should be consumed, others should remain
      expect(screen.getByTestId('insets-top')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-right')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('34');
      expect(screen.getByTestId('insets-left')).toHaveTextContent('0');
    });

    it('should combine consumedEdges and consumedInsets when both are provided', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider
            consumedInsets={{ top: 10, bottom: 10 }}
            consumedEdges={['top']}
          >
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // consumedEdges completely consumes top, consumedInsets partially consumes bottom
      expect(screen.getByTestId('insets-top')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('24'); // 34 - 10 from consumedInsets
    });

    it('should handle nested providers with consumedEdges', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedEdges={['top']}>
            <NestedSafeAreaProvider consumedEdges={['bottom']}>
              <TestComponent />
            </NestedSafeAreaProvider>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // First provider consumes top (44 -> 0), second consumes bottom (34 -> 0)
      expect(screen.getByTestId('insets-top')).toHaveTextContent('0');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('0');
    });

    it('should handle empty consumedEdges array', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedEdges={[]}>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Empty array should not consume anything
      expect(screen.getByTestId('insets-top')).toHaveTextContent('44');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('34');
    });

    it('should reset specified edges to original safe area values with resetEdges', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedInsets={{ top: 20, bottom: 10 }}>
            <NestedSafeAreaProvider resetEdges={['top']}>
              <TestComponent />
            </NestedSafeAreaProvider>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Top should be reset to original value (44), bottom should remain consumed (34 - 10 = 24)
      expect(screen.getByTestId('insets-top')).toHaveTextContent('44');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('24');
    });

    it('should reset all specified edges with resetEdges', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedEdges={['top', 'bottom']}>
            <NestedSafeAreaProvider resetEdges={['top', 'bottom']}>
              <TestComponent />
            </NestedSafeAreaProvider>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Both top and bottom should be reset to original values
      expect(screen.getByTestId('insets-top')).toHaveTextContent('44');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('34');
    });

    it('should prioritize resetEdges over consumedEdges and consumedInsets', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider
            consumedInsets={{ top: 10, bottom: 10 }}
            consumedEdges={['bottom']}
            resetEdges={['top', 'bottom']}
          >
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Both edges should be reset despite consumedInsets and consumedEdges
      expect(screen.getByTestId('insets-top')).toHaveTextContent('44');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('34');
    });

    it('should handle nested providers with resetEdges', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedEdges={['top', 'bottom']}>
            <NestedSafeAreaProvider resetEdges={['top']}>
              <NestedSafeAreaProvider consumedInsets={{ top: 10 }}>
                <TestComponent />
              </NestedSafeAreaProvider>
            </NestedSafeAreaProvider>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // First provider consumes top and bottom (both -> 0)
      // Second provider resets top to original (44)
      // Third provider consumes 10 from top (44 - 10 = 34)
      expect(screen.getByTestId('insets-top')).toHaveTextContent('34');
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('0');
    });

    it('should handle empty resetEdges array', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedInsets={{ top: 20 }}>
            <NestedSafeAreaProvider resetEdges={[]}>
              <TestComponent />
            </NestedSafeAreaProvider>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Empty resetEdges array should not reset anything
      expect(screen.getByTestId('insets-top')).toHaveTextContent('24'); // 44 - 20
      expect(screen.getByTestId('insets-bottom')).toHaveTextContent('34');
    });
  });

  describe('NestedSafeAreaView', () => {
    it('should apply padding for all edges by default', () => {
      const { getByTestId } = render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider>
            <NestedSafeAreaView testID="safe-area-view">
              <Text>Content</Text>
            </NestedSafeAreaView>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      const view = getByTestId('safe-area-view');
      const flattenedStyle = Array.isArray(view.props.style)
        ? Object.assign({}, ...view.props.style.filter(Boolean))
        : view.props.style;
      expect(flattenedStyle).toMatchObject({
        paddingTop: 44,
        paddingRight: 0,
        paddingBottom: 34,
        paddingLeft: 0,
      });
    });

    it('should apply padding only for specified edges', () => {
      const { getByTestId } = render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider>
            <NestedSafeAreaView
              edges={['top', 'bottom']}
              testID="safe-area-view"
            >
              <Text>Content</Text>
            </NestedSafeAreaView>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      const view = getByTestId('safe-area-view');
      const flattenedStyle = Array.isArray(view.props.style)
        ? Object.assign({}, ...view.props.style.filter(Boolean))
        : view.props.style;
      expect(flattenedStyle).toMatchObject({
        paddingTop: 44,
        paddingBottom: 34,
      });
      expect(flattenedStyle.paddingLeft).toBeUndefined();
      expect(flattenedStyle.paddingRight).toBeUndefined();
    });

    it('should provide nested context that consumes used insets', () => {
      const NestedTestComponent = () => {
        const insets = useNestedSafeAreaInsets();
        return (
          <View>
            <Text testID="nested-insets-top">{insets.top}</Text>
            <Text testID="nested-insets-bottom">{insets.bottom}</Text>
          </View>
        );
      };

      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider>
            <NestedSafeAreaView edges={['top']}>
              <NestedTestComponent />
            </NestedSafeAreaView>
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      // Top should be consumed (0), bottom should remain (34)
      expect(screen.getByTestId('nested-insets-top')).toHaveTextContent('0');
      expect(screen.getByTestId('nested-insets-bottom')).toHaveTextContent(
        '34'
      );
    });
  });

  describe('useNestedSafeAreaContext', () => {
    it('should throw error when used outside provider', () => {
      const TestComponentOutsideProvider = () => {
        try {
          useNestedSafeAreaContext();
          return <Text>Should not render</Text>;
        } catch (error) {
          return <Text testID="error">{(error as Error).message}</Text>;
        }
      };

      render(<TestComponentOutsideProvider />);

      expect(screen.getByTestId('error')).toHaveTextContent(
        'useNestedSafeAreaContext must be used within a NestedSafeAreaProvider'
      );
    });
  });

  describe('useNestedSafeAreaInsets', () => {
    it('should return current insets from context', () => {
      render(
        <SafeAreaProvider>
          <NestedSafeAreaProvider consumedInsets={{ top: 10 }}>
            <TestComponent />
          </NestedSafeAreaProvider>
        </SafeAreaProvider>
      );

      expect(screen.getByTestId('insets-top')).toHaveTextContent('34'); // 44 - 10
    });
  });
});
