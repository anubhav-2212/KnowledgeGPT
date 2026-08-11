import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import AuthForms from '../components/auth/AuthForms';

export default function AuthPage() {
  return (
    <AuthLayout>
      <AuthForms />
    </AuthLayout>
  );
}
