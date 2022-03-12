import { Dispatch, SetStateAction } from "react";

interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: Dispatch<SetStateAction<string>>;
}

export default function InputGroup({
  className,
  type,
  placeholder,
  value,
  error,
  setValue,
}: InputGroupProps) {
  return (
    <>
      <input className={`w-full p-3 transition duration-200 border border-gray-300 dark:placeholder-gray-200 rounded outline-none bg-gray-50 dark:bg-slate-500 focus:bg-white dark:focus:bg-slate-400 hover:bg-white dark:hover:bg-slate-600 
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