interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

const InputGroup = ({
  className,
  type,
  placeholder,
  value,
  error,
  setValue,
}: InputGroupProps) => {
  return (
    <>
      <input className={`w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white 
        ${error && ' border-red-500'} ${className}`}
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </>
  )
}

export default InputGroup;