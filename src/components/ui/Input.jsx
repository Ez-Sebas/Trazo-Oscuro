export const Input = ({ label, type = 'text', value, onChange, error, name, placeholder, maxLength }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={name} className="text-texto-secundario text-xs sm:text-sm">
                {label}
            </label>
            <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} className={`bg-fondo border rounded-md px-3 py-2 text-texto text-sm w-full focus:outline-none transition-colors ${ error ? 'border-red-500' : 'border-borde focus:border-acento'}`}/>
            {error && (
                <span className="text-red-500 text-xs">{error}</span>
            )}
        </div>
    )
}