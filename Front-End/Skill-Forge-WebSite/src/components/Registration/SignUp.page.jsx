import React from 'react'
import {motion} from 'framer-motion';

function SignUp() {
  return (
    <motion.div
    initial={{ opacity: 0, y : 20 }}
    animate={{opacity: 1 ,y: 0}}
    transition={{duration: 0.5}}
    className='max-w-md w-full backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >

      <div>
        
      </div>


    </motion.div>
  )
}

export default SignUp;
