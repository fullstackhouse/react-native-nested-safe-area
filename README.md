# react-native-nested-safe-area

A wrapper on top of react-native-safe-area-context that allows nested safe area contexts with automatic inset consumption tracking.

## Features

- **Nested Context Support**: Stack multiple safe area providers without overlapping insets
- **Automatic Consumption**: Automatically tracks and subtracts consumed insets in nested contexts
- **React Integration**: Built-in React Context and hooks
- **Cross-Platform**: Works on iOS, Android, and Web
- **TypeScript Support**: Fully typed with TypeScript
- **Edge Control**: Selectively apply safe area insets to specific edges

## Installation

```sh
npm install react-native-nested-safe-area
# or
yarn add react-native-nested-safe-area
```

### Dependencies

This library depends on `react-native-safe-area-context`. If you don't have it installed:

```sh
npm install react-native-safe-area-context
# or
yarn add react-native-safe-area-context
```

Follow the [react-native-safe-area-context installation guide](https://github.com/th3rdwave/react-native-safe-area-context#getting-started) for platform-specific setup.

## Usage

### Basic Usage with NestedSafeAreaView

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { NestedSafeAreaView } from 'react-native-nested-safe-area';

export default function App() {
  return (
    <NestedSafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <NestedSafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, backgroundColor: 'lightblue' }}
      >
        <Text>First safe area - has padding for top, left, right edge</Text>

        <NestedSafeAreaView
          edges={['bottom']}
          style={{ backgroundColor: 'blue', marginTop: 'auto' }}
        >
          <Text>Nested safe area - has padding for bottom edge</Text>
        </NestedSafeAreaView>
      </NestedSafeAreaView>
    </NestedSafeAreaView>
  );
}
```

### Using with Provider and Hook

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import {
  NestedSafeAreaProvider,
  useNestedSafeAreaInsets,
} from 'react-native-nested-safe-area';

function MyComponent() {
  const insets = useNestedSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <NestedSafeAreaProvider consumedInsets={{ top: insets.top }}>
        <Text>Content with consumed top inset</Text>
      </NestedSafeAreaProvider>
    </View>
  );
}

export default function App() {
  return (
    <NestedSafeAreaProvider>
      <MyComponent />
    </NestedSafeAreaProvider>
  );
}
```

### Using consumedEdges for Complete Edge Consumption

The `consumedEdges` prop provides a convenient way to completely consume specific edges, setting them to zero in nested contexts:

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { NestedSafeAreaProvider } from 'react-native-nested-safe-area';

export default function App() {
  return (
    <NestedSafeAreaProvider>
      {/* Header consumes top edge completely */}
      <View style={{ backgroundColor: 'blue', padding: 20 }}>
        <Text>Header</Text>
      </View>
      
      {/* Main content - top edge is now zero for nested components */}
      <NestedSafeAreaProvider consumedEdges={['top']}>
        <View style={{ flex: 1 }}>
          <Text>Main content (top safe area consumed)</Text>
          
          {/* Footer consumes bottom edge */}
          <NestedSafeAreaProvider consumedEdges={['bottom']}>
            <View style={{ backgroundColor: 'green', marginTop: 'auto' }}>
              <Text>Footer (bottom safe area consumed)</Text>
            </View>
          </NestedSafeAreaProvider>
        </View>
      </NestedSafeAreaProvider>
    </NestedSafeAreaProvider>
  );
}
```

### Edge-Specific Safe Areas

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { NestedSafeAreaView } from 'react-native-nested-safe-area';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      {/* Header with only top safe area */}
      <NestedSafeAreaView edges={['top']} style={{ backgroundColor: 'blue' }}>
        <Text>Header</Text>
      </NestedSafeAreaView>

      {/* Content area with left/right safe areas */}
      <NestedSafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
        <Text>Main content</Text>
      </NestedSafeAreaView>

      {/* Footer with only bottom safe area */}
      <NestedSafeAreaView
        edges={['bottom']}
        style={{ backgroundColor: 'green' }}
      >
        <Text>Footer</Text>
      </NestedSafeAreaView>
    </View>
  );
}
```

## API Reference

### NestedSafeAreaView

A View component that applies safe area insets as padding and automatically provides consumed insets to nested contexts.

```typescript
<NestedSafeAreaView edges?: Array<'top' | 'right' | 'bottom' | 'left'> />
```

Props:

- `edges?: Array<'top' | 'right' | 'bottom' | 'left'>` - Which edges to apply safe area to (default: all edges)
- Inherits all React Native `View` props

### NestedSafeAreaProvider

Provides nested safe area context with automatic inset consumption tracking.

```typescript
<NestedSafeAreaProvider 
  consumedInsets?: Partial<EdgeInsets>
  consumedEdges?: Edge[]
>
  {children}
</NestedSafeAreaProvider>
```

Props:

- `consumedInsets?: Partial<EdgeInsets>` - Insets to subtract from parent context
- `consumedEdges?: Edge[]` - List of edges to completely consume (set to zero). Takes precedence over `consumedInsets` when provided
- `children: ReactNode` - Child components

#### Edge Type

```typescript
type Edge = 'top' | 'right' | 'bottom' | 'left';
```

### useNestedSafeAreaInsets()

Hook to access current safe area insets in nested context.

```typescript
const insets = useNestedSafeAreaInsets();
```

Returns:

- `insets: EdgeInsets` - Current safe area insets (`{ top, right, bottom, left }`)

### useNestedSafeAreaContext()

Hook to access the full nested safe area context.

```typescript
const { insets, consumeInsets } = useNestedSafeAreaContext();
```

Returns:

- `insets: EdgeInsets` - Current safe area insets
- `consumeInsets: (consumed: Partial<EdgeInsets>) => EdgeInsets` - Function to calculate consumed insets

## How It Works

1. **Base Context**: The root `NestedSafeAreaProvider` gets insets from `react-native-safe-area-context`
2. **Consumption Tracking**: Each nested provider subtracts consumed insets from its parent context
3. **Automatic Management**: `NestedSafeAreaView` automatically applies insets as padding and marks them as consumed
4. **Edge Control**: Use the `edges` prop to selectively apply insets to specific sides

## Platform Support

- ✅ **iOS**: Full support with react-native-safe-area-context
- ✅ **Android**: Full support with react-native-safe-area-context
- ✅ **Web**: Full support with react-native-safe-area-context

## License

MIT
