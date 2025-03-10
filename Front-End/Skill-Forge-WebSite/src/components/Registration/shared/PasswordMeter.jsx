import {Check, X} from 'lucide-react';

const PasswordCriteria = ({password}) => {

  const criteria = [
    {lable: "At last 6 characters",met: password.length >= 6},
    {lable: "Contains upperCase letter",met: /[A-Z]/.test(password)},
    {lable: "Contains lowercase letter",met: /[a-z]/.test(password)},
    {lable: "Contains a  number",met: /\d/.test(password)},
    {lable: "Contains special character",met: /[^a-zA-Z\d]/.test(password)},
  ];

  return(
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div className="flex items-center text-xs" key={item.lable}>
          {item.met ? (
                <Check className=" size-4 text-green-500 mr-2"></Check>
              ) : (
                <X className="size-4 text-red-500 mr-2"></X>
              )}
              <span className={item.met ? "text-green-500" : "text-gray-400"}>{item.lable}</span>
        </div>
      ))}
    </div>
  );
}

const PasswordMeter = ({password}) => {

  const getStrength = (pass = '') => {
    let strength = 0;
    if (!pass) return strength;
    if (pass.length >= 6) strength++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = () => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
      if (strength === 0) return "Very Weak";
      if (strength === 1) return "Weak";
      if (strength === 2) return "Fair";
      if (strength === 3) return "Good";
      return "Strong";
  };
  return (
    <div className='mt-2'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-xs text-gray-400'>Password Strength</span>
          <span className='text-xs text-gray-400 '>{getStrengthText(strength)}</span>
        </div>
        <div className='flex space-x-1'>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${index < strength ? getColor(strength) : "bg-gray-600"}`}
              />
            ))}
        </div>
        <PasswordCriteria password={password}/>
    </div>
  )
};

export default PasswordMeter;
