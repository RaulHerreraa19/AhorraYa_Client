import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { motion } from 'framer-motion';

const MySwal = withReactContent(Swal);

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            MySwal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: 'Login successful',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/dashboard');
        } catch (err: any) {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Login failed. Please check your credentials.',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-100/50 blur-3xl"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-sky-100/40 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-10"
            >
                <div className="text-center">
                    <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 tracking-tight mb-2">AhorraYa</h2>
                    <p className="text-slate-500 text-lg">Inicia sesión para ahorrar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
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
                        className="w-full btn-primary py-3 text-lg shadow-blue-200/50 hover:shadow-blue-300/50"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                <p className="text-sm text-center text-slate-500">
                    ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all">Regístrate</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
