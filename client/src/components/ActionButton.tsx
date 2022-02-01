const ActionButton = ({ children }: { children: React.ReactNode}) => {
  return <div className='px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
    {children}
  </div>
}

export default ActionButton;