import Container from '@/components/Layout/Container';
import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <Container className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <div className=" mx-auto bg-white rounded-lg shadow p-6">
        <div className="text-gray-500">Contact form will be displayed here</div>
      </div>
    </Container>
  );
};

export default ContactPage;