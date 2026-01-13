
const Header = () => {
    return (
        <header className=" w-full border-2 bg-grey-100 border-gray-300 text-white h-16">                    
            <nav className="flex items-center justify-end">            
                  <div className="grow">
                    <img src="/logo.png" alt="AhorraYa Logo" className="h-15 w-20 ml-10"/>
                </div>
                <ul className="flex space-x-2 mr-10" >
                    <li className="text-black rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-105 hover:bg-gray-300"><a href="/#">Inicio</a></li>
                    <li className="text-black rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-105 hover:bg-gray-300"><a href="/#">Características</a></li>
                    <li className="text-black rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-105 hover:bg-gray-300"><a href="/#">Precios</a></li>
                    <li className="text-black rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-105 hover:bg-gray-300"><a href="/#">Contacto</a></li>
                    <li className="text-black rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-105 hover:bg-gray-300"><a href="/login">Iniciar Sesión</a></li>
                </ul>                                
            </nav>          
        </header>
    );
}
export default Header;