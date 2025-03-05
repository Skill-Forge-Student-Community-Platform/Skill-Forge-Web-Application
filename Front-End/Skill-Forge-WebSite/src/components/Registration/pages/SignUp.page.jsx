import React, { useState } from 'react';
import {motion} from 'framer-motion';
import Input from '../shared/input';
import {User, Mail, Lock, Loader} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import PasswordMeter from '../shared/PasswordMeter';
import { useAuthStore } from '../../../store/authStore';

function SignUp() {

  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signup( username , email, password);
      navigate("/auth/verify-email")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <motion.div
    initial={{ opacity: 0, y : 20 }}
    animate={{opacity: 1 ,y: 0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >

      <div className='p-6 overflow-hidden'>
          <h2 className='!text-2xl !font-bold mb-4 text-center bg-white text-transparent bg-clip-text'>
              Create Account
          </h2>
          <form onSubmit={handleSignup} className="space-y-2 overflow-hidden">

            <Input
              icon={User}
              type='text'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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

            {error && <p className=' text-left text-red-500 text-xs font-semibold mt-1 mb-1'>{error}</p>}
            {/* password meter */}
            <PasswordMeter password={password} />

             <motion.button className='mt-3 w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-bold shadow-lg
             hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
             >
                {isLoading ? <Loader className='animate-spin mx-auto size-4' /> : "Sign Up"}
             </motion.button>
          </form>
      </div>
        <div className='px-6 py-3 bg-gray-900 bg-opacity-50 flex justify-center'>
              <p className="text-sm">
                Already have an account? {" "}
                <Link to ="/auth/login" className='text-green-400 hover:underline'
                >Login</Link>
              </p>
        </div>

    </motion.div>
  )
}

export default SignUp;
