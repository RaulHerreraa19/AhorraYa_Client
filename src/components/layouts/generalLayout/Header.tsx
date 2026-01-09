
const Header = () => {
    return (
        <header className="container mx-auto p-4">
            <nav className="mt-4 mb-4 flex justify-end">
                <ul className="flex space-x-4" >
                    <li className=""><a href="/">Inicio</a></li>
                    <li><a href="/features">Características</a></li>
                    <li><a href="/pricing">Precios</a></li>
                    <li><a href="/contact">Contacto</a></li>
                </ul>
                                
            </nav>
            <div className="flex-col w-full">
                <div className="row-auto  bg-red-900">
                    <h1 className="text-2xl font-bold">Bienvendio a AhorraYa</h1>  
                    <p className="">Tu plataforma para gestionar y optimizar tus ahorros de manera eficiente.</p>
                </div>
                <div className="row">
                    <h1 className="text-2xl font-bold">Bienvendio a AhorraYa</h1>  
                    <p className="">Tu plataforma para gestionar y optimizar tus ahorros de manera eficiente.</p>
                </div>
            </div>
        </header>
    );
}
export default Header;