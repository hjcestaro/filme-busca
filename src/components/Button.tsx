interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{}

export default function Button({ 
  onClick, 
  className = "", 
  children,
  ...props 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className={`bg-black text-white hover:bg-white hover:text-black p-2 ml-2 rounded cursor-pointer ${className}`}
      {...props}
    >
      {children || 'Procurar'}
    </button>
  );
}