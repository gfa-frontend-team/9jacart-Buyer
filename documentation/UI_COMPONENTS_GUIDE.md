# UI Components Guide

This guide covers all the reusable UI components created for your e-commerce website.

## Components Overview

### 1. Breadcrumb Component

A flexible breadcrumb navigation component that supports both auto-generation from URL and custom items.

#### Features:

- **Auto-generation**: Automatically creates breadcrumbs from the current URL path
- **Custom items**: Accept custom breadcrumb items with labels and links
- **Home icon**: Optional home icon at the beginning
- **Custom separator**: Customizable separator between items
- **Accessibility**: Proper ARIA labels and current page indication

#### Usage Examples:

```tsx
import { Breadcrumb } from '../components/UI';

// Auto-generated from current URL
<Breadcrumb />

// Custom breadcrumb items
const items = [
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'iPhone 15', isCurrentPage: true }
];
<Breadcrumb items={items} />

// Without home icon
<Breadcrumb showHome={false} />

// Custom separator
<Breadcrumb separator={<span>→</span>} />
```

#### Props:

- `items?: BreadcrumbItem[]` - Custom breadcrumb items
- `className?: string` - Additional CSS classes
- `showHome?: boolean` - Show home icon (default: true)
- `separator?: React.ReactNode` - Custom separator element

### 2. Button Component

A versatile button component with multiple variants and sizes.

#### Variants:

- `default` - Primary button style
- `secondary` - Secondary button style
- `outline` - Outlined button
- `destructive` - For dangerous actions
- `ghost` - Minimal button style
- `link` - Link-styled button

#### Sizes:

- `sm` - Small button
- `default` - Standard size
- `lg` - Large button
- `icon` - Square button for icons

#### Usage:

```tsx
import { Button } from "../components/UI";

<Button variant="default" size="lg">
  Primary Button
</Button>;
```

### 3. Card Components

A set of card components for structured content display.

#### Components:

- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title element
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

#### Usage:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "../components/UI";

<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>Product details go here...</CardContent>
</Card>;
```

### 4. Input Component

A styled input component with focus states and accessibility features.

#### Usage:

```tsx
import { Input } from "../components/UI";

<Input type="email" placeholder="Enter your email" className="w-full" />;
```

### 5. Badge Component

Small status indicators with multiple variants.

#### Variants:

- `default` - Primary badge
- `secondary` - Secondary badge
- `destructive` - Error/danger badge
- `outline` - Outlined badge
- `success` - Success badge
- `warning` - Warning badge

#### Usage:

```tsx
import { Badge } from '../components/UI';

<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
```

### 6. Alert Component

Alert messages with different severity levels and optional icons.

#### Variants:

- `default` - Standard alert
- `info` - Informational alert
- `success` - Success message
- `warning` - Warning message
- `destructive` - Error message

#### Usage:

```tsx
import { Alert } from "../components/UI";

<Alert variant="success" title="Success!">
  Your order has been placed successfully.
</Alert>;
```

### 7. Modal Component

A flexible modal dialog with backdrop and keyboard support.

#### Features:

- Backdrop click to close
- Escape key to close
- Body scroll lock when open
- Multiple sizes
- Optional title header

#### Usage:

```tsx
import { Modal } from "../components/UI";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to continue?</p>
  <div className="flex justify-end gap-2 mt-4">
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>;
```

### 8. Loading Component

Simple loading spinner with different sizes.

#### Sizes:

- `sm` - Small spinner
- `md` - Medium spinner (default)
- `lg` - Large spinner

#### Usage:

```tsx
import { Loading } from "../components/UI";

<Loading size="lg" className="mx-auto" />;
```

## Implementation Examples

### Product Card with Breadcrumb

```tsx
import { Card, CardContent, Badge, Breadcrumb } from "../components/UI";

const ProductPage = () => {
  const breadcrumbItems = [
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "iPhone 15", isCurrentPage: true },
  ];

  return (
    <div className="p-6">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">iPhone 15</h1>
            <Badge variant="success">In Stock</Badge>
          </div>
          <p className="text-gray-600 mt-2">
            Latest iPhone with advanced features
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
```

### Form with Validation

```tsx
import { Input, Button, Alert } from "../components/UI";

const LoginForm = () => {
  const [error, setError] = useState("");

  return (
    <form className="space-y-4">
      {error && (
        <Alert variant="destructive" title="Error">
          {error}
        </Alert>
      )}

      <Input type="email" placeholder="Email address" required />

      <Input type="password" placeholder="Password" required />

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
};
```

## Demo Page

Visit `/demo` in your application to see all components in action with interactive examples.

## Customization

All components use Tailwind CSS classes and can be customized by:

1. **Passing custom className props**
2. **Modifying the component variants in the source files**
3. **Updating the Tailwind theme in your CSS file**

## Accessibility

All components follow accessibility best practices:

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## TypeScript Support

All components are fully typed with TypeScript interfaces exported for your use:

```tsx
import type { ButtonProps, BreadcrumbItem, AlertProps } from "../components/UI";
```
