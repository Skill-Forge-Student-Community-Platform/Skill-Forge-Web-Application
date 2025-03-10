import { useState } from 'react';
import { motion } from 'framer-motion';
import {Mail ,Lock ,Loader} from "lucide-react";
import Input from '../shared/input';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { login, isLoading, error } = useAuthStore();

    const validateForm = () => {
      // Reset form error
      setFormError('');

      // Check for empty fields
      if (!email.trim() && !password.trim()) {
        setFormError('Email and password are required');
        return false;
      }

      if (!email.trim()) {
        setFormError('Email is required');
        return false;
      }

      if (!password.trim()) {
        setFormError('Password is required');
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFormError('Please enter a valid email address');
        return false;
      }

      return true;
    };

    const handleLogin = async (e) => {
      e.preventDefault();

      // Validate form before attempting login
      if (!validateForm()) {
        return;
      }

      try {
        await login(email, password);
      } catch (err) {
        // Error is handled by the store and displayed via the error prop
        console.log('Login error:', err);
      }
    };

  return (
    <motion.div
    initial={{ opacity: 0, y : 20 }}
    animate={{opacity: 1 ,y: 0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
      <div className='p-8'>
      <h2 className='!text-3xl !font-bold mb-6 text-center bg-white text-transparent bg-clip-text'>
              Welcome Back !
          </h2>

          <form onSubmit={handleLogin}>

          <Input
              icon={Mail}
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          <Input
              icon={Lock}
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          <div className='flex items-center mb-6'>
              <Link to='/auth/forgot-password' className='text-sm text-green-400 hover:underline'>
                  Forgot Password ?
              </Link>
          </div>

          {/* Display form validation errors */}
          {formError && <p className='text-left text-red-500 text-xs font-semibold mt-1 mb-1'>{formError}</p>}

          {/* Display API errors */}

          {error && <p className=' text-left text-red-500 text-xs font-semibold mt-1 mb-1'>{error}</p>}

          <motion.button className='mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg         text-white font-bold shadow-lg
          hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500          focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? <Loader className='animate-spin mx-auto size-4' /> : "Login"}
          </motion.button>

          </form>

      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
          <p className='text-sm text-gray-400'>
              Don&apos;t have an account? {" "}
              <Link to="/auth/signup" className='text-green-400 hover:underline'>
                  Sign Up
              </Link>
          </p>
      </div>
    </motion.div>
  );
};

export default Login;
