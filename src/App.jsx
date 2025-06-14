import React from 'react';
import KeyboardConfigurator from './KeyboardConfigurator';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-center">
        <a href="https://nimbusgaming.in/">
          <img src={`${process.env.PUBLIC_URL}/images/Logo/Nimbus_Logo.png`} alt="Nimbus Logo" className="h-10 w-auto" />
        </a>
      </header>
      {/* Main Content */}
      <main className="flex-1">
        <KeyboardConfigurator />
      </main>
      {/* Footer */}
      <footer className="w-full bg-white border-t py-4 px-6 text-center text-gray-500 text-sm mt-8">
        © {new Date().getFullYear()} Nimbus Gaming. All rights reserved. | <a href="https://nimbusgaming.in/policies/privacy-policy" className="hover:text-blue-600">Privacy Policy</a> | <a href="https://nimbusgaming.in/policies/contact-information" className="hover:text-blue-600">Contact</a>
      </footer>
    </div>
  );
}

export default App; 