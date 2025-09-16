import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Loading,
  Breadcrumb,
  Modal,
  Alert,
  Image,
} from '../../components/UI';

const UIComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom breadcrumb for demo page
  const breadcrumbItems = [
    { label: 'Components', href: '/components' },
    { label: 'UI Demo', isCurrentPage: true },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumb Demo */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Breadcrumb Examples</h2>
          <div className="space-y-4 bg-white p-6 rounded-lg">
            <div>
              <h3 className="font-semibold mb-2">Auto-generated from URL:</h3>
              <Breadcrumb />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Custom breadcrumb items:</h3>
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Without home icon:</h3>
              <Breadcrumb items={breadcrumbItems} showHome={false} />
            </div>
          </div>
        </div>

        {/* Buttons Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Alert Variants</h2>
          <Alert title="Information" variant="info">
            This is an informational alert with some additional context.
          </Alert>
          <Alert title="Success" variant="success">
            Your action was completed successfully!
          </Alert>
          <Alert title="Warning" variant="warning">
            Please review the following information carefully.
          </Alert>
          <Alert title="Error" variant="destructive">
            There was an error processing your request.
          </Alert>
        </div>

        {/* Input Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Input Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-w-md">
              <Input placeholder="Enter your email" type="email" />
              <Input placeholder="Enter your password" type="password" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </CardContent>
        </Card>

        {/* Loading Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Loading size="sm" />
                <p className="text-sm mt-2">Small</p>
              </div>
              <div className="text-center">
                <Loading size="md" />
                <p className="text-sm mt-2">Medium</p>
              </div>
              <div className="text-center">
                <Loading size="lg" />
                <p className="text-sm mt-2">Large</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Optimized Image Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Square Aspect Ratio</h4>
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
                  alt="Product example"
                  aspectRatio="square"
                  className="w-full"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">16:9 Aspect Ratio</h4>
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=225&fit=crop"
                  alt="Store banner"
                  aspectRatio="16/9"
                  className="w-full"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">With Lazy Loading</h4>
                <Image
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop"
                  alt="Shopping cart"
                  aspectRatio="3/2"
                  lazy={true}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Modal Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </CardContent>
        </Card>

        {/* Modal Component */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          size="md"
        >
          <div className="space-y-4">
            <p>This is an example modal dialog. You can put any content here.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UIComponentsDemo;