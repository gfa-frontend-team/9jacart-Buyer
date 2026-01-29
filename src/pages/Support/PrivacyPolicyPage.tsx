import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header section styled like "What Sets Us Apart" */}
      <section className="py-20 px-4 bg-[#182F38]">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Centered content container with gray border */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-card border border-gray-300 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-muted-foreground mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>

            <p className="text-muted-foreground mb-2">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
              <li>Excepteur sint occaecat cupidatat non proident</li>
              <li>Sunt in culpa qui officia deserunt mollit anim id est laborum</li>
            </ul>

            <p className="text-muted-foreground mb-2">
              Curabitur pretium tincidunt lacus nulla pharetra:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
              <li>Nulla facilisi integer lacinia sollicitudin massa</li>
              <li>Cras metus sed aliquet risus a tortor</li>
              <li>Integer id quam orci ultricies congue</li>
            </ul>

            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              accumsan lacus vel facilisis. Egestas egestas fringilla phasellus
              faucibus scelerisque eleifend donec pretium vulputate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
