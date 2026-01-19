import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { motion } from 'framer-motion';

const MySwal = withReactContent(Swal);

const Register: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            MySwal.fire({
                icon: 'success',
                title: 'Account Created!',
                text: 'You can now log in.',
                confirmButtonColor: '#10b981'
            });
            navigate('/login');
        } catch (err: any) {
            MySwal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'Something went wrong. Please try again.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] -right-[5%] w-[35%] h-[35%] rounded-full bg-blue-100/50 blur-3xl"></div>
                <div className="absolute -bottom-[5%] left-[10%] w-[40%] h-[40%] rounded-full bg-cyan-100/40 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-10"
            >
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600 tracking-tight">Únete a AhorraYa</h2>
                    <p className="text-slate-500 mt-2 text-lg">Comienza tu ahorro hoy</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Nombre Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="tu@ejemplo.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-blue-200/50 transform hover:-translate-y-0.5 font-medium text-lg mt-2"
                    >
                        Crear Cuenta
                    </button>
                </form>
                <p className="text-sm text-center text-slate-500">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all">Iniciar Sesión</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
