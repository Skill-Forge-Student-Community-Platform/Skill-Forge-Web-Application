import React from 'react'
import {motion} from 'framer-motion';
import Input from './input';
import {User ,Mail ,Lock} from "lucide-react";
import { Link } from 'react-router-dom';
import PasswordMeter from './PasswordMeter';

function SignUp() {

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignup = (e) => {
    e.preventDefault();
  }

  return (
    <motion.div
    initial={{ opacity: 0, y : 20 }}
    animate={{opacity: 1 ,y: 0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >

      <div className='p-8'>
          <h2 className='!text-3xl !font-bold mb-6 text-center bg-white text-transparent bg-clip-text'>
              Create Account
          </h2>
          <form onSubmit={handleSignup}>

             <Input
              icon={User}
              type='text'
              placeholder='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            {/* password meter */}
            <PasswordMeter password={password} />

             <motion.button className='mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-bold shadow-lg
             hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
             >
                Sign Up
             </motion.button>
          </form>
      </div>
        <divc className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
              <p>
                Already have an account? {" "}
                <Link to ="auth/login" className='text-green-400 hover:underline'
                >Login</Link>
              </p>
        </divc>

    </motion.div>
  )
}

export default SignUp;
