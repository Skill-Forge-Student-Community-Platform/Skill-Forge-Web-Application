import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Login from './pages/Login.page';
import SignUp from './pages/SignUp.page';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgetPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginImagePattern from './shared/LoginImagePattern';
import { RedirectAuthenticatedUser } from './AuthGuard';
import { Toaster } from 'react-hot-toast';

function Authentications() {
  const location = useLocation();

  // Determine page type for dynamic content
  const getPageContent = () => {
    const path = location.pathname;

    if (path.includes('/signup')) {
      return {
        title: 'Join the Skill Forge Community',
        action: 'Sign up',
        subtitle: 'Start your professional development journey',
        quote: 'The best time to start learning was yesterday. The second best time is now.',
        quoteAuthor: 'Chinese Proverb'
      };
    }

    if (path.includes('/forgot-password')) {
      return {
        title: 'Recover Your Account',
        action: 'Reset',
        subtitle: 'Regain access to your learning platform',
        quote: 'Everyone forgets sometimes. Let\'s get you back on track.',
        quoteAuthor: 'Skill Forge Team'
      };
    }

    if (path.includes('/verify-email')) {
      return {
        title: 'Confirm Your Identity',
        action: 'Verify',
        subtitle: 'Complete your registration process',
        quote: 'One small step for verification, one giant leap for your professional growth.',
        quoteAuthor: null
      };
    }

    if (path.includes('/reset-password')) {
      return {
        title: 'Secure Your Account',
        action: 'Reset',
        subtitle: 'Create a new password for your profile',
        quote: 'A fresh start is just a new password away. Secure your journey to skill development.',
        quoteAuthor: null
      };
    }

    // Default for login
    return {
      title: 'Continue Your Learning Journey',
      action: 'Sign in',
      subtitle: 'Access your personalized skill development dashboard',
      quote: 'Every expert was once a beginner. Welcome back to your skill development journey.',
      quoteAuthor: null
    };
  };

  const { title, action, subtitle, quote, quoteAuthor } = getPageContent();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 border-l-cyan-800 to-sky-600">
      <div className="h-full w-full grid lg:grid-cols-2">
        {/* Left Side - Form Container */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-10 backdrop-filter backdrop-blur-xl overflow-hidden">
          <div className="w-full max-w-md">
            {/* Logo & Header */}
            <div className="text-center mb-6">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30
                  transition-colors"
                >
                  <MessageSquare className="w-6 h-6 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mt-2 text-white">{title}</h1>
                <p className="text-sm text-gray-400">{subtitle}</p>
              </div>
            </div>

            {/* Auth Forms Container */}
            <div className="bg-gray-800/40 rounded-xl overflow-hidden">
              <Routes>
                <Route path='/signup' element={
                  <RedirectAuthenticatedUser>
                    <SignUp />
                  </RedirectAuthenticatedUser>
                } />

                <Route path='/login' element={
                  <RedirectAuthenticatedUser>
                    <Login />
                  </RedirectAuthenticatedUser>
                } />

                <Route path='/verify-email' element={<EmailVerificationPage />} />

                <Route path='/forgot-password' element={
                  <RedirectAuthenticatedUser>
                    <ForgotPasswordPage />
                  </RedirectAuthenticatedUser>
                } />

                <Route path='/reset-password/:token' element={
                  <RedirectAuthenticatedUser>
                    <ResetPasswordPage />
                  </RedirectAuthenticatedUser>
                } />

                {/* Redirect from /auth to /auth/login as default */}
                <Route path='/' element={<Navigate to="/auth/login" replace />} />
                <Route path='*' element={<Navigate to="/auth/login" replace />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Pattern with inspirational content */}
        <LoginImagePattern
          title={`Welcome to Skill Forge`}
          subtitle={`${action} to continue your professional journey and build your skills.`}
          quote={quote}
          quoteAuthor={quoteAuthor}
        />
      </div>
      <Toaster />
    </div>
  );
}

export default Authentications;
