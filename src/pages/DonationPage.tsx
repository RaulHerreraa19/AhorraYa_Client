import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Heart, Copy, Check } from 'lucide-react';

const DonationPage: React.FC = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = React.useState<string | null>(null);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    const donateData = {
        paypal: "https://www.paypal.me/raulherreraa19",
        bank: {
            name: "Raul Herrera",
            bankName: "BBVA",
            clabe: "012 180 0154001557168",
            account: "154 001 5716"
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-100/50 blur-3xl"></div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Panel
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-red-100 text-red-600 rounded-2xl mb-4 shadow-sm">
                        <Heart size={32} fill="currentColor" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Apoya el Proyecto</h1>
                    <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                        Si AhorraYa te ha ayudado a alcanzar tus metas, considera hacer una donación para mantener el servidor y seguir mejorando la plataforma.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PayPal Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-100/50 border border-slate-100 flex flex-col items-center text-center"
                    >
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-8 object-contain" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">PayPal</h2>
                        <p className="text-slate-500 mb-8 text-sm">Rápido y seguro mediante tarjeta o saldo PayPal.</p>
                        <a
                            href={donateData.paypal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-200"
                        >
                            Donar por PayPal
                        </a>
                    </motion.div>

                    {/* Bank Transfer Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-cyan-100/50 border border-slate-100"
                    >
                        <div className="h-16 w-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mb-6 mx-auto">
                            <CreditCard size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Transferencia</h2>
                        <p className="text-slate-500 mb-6 text-sm text-center">Transferencia bancaria directa (SPEI).</p>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">CLABE</p>
                                <div className="flex justify-between items-center">
                                    <p className="font-mono text-slate-700 font-bold">{donateData.bank.clabe}</p>
                                    <button
                                        onClick={() => handleCopy(donateData.bank.clabe, 'clabe')}
                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                    >
                                        {copied === 'clabe' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">Banco</p>
                                    <p className="text-sm font-bold text-slate-700">{donateData.bank.bankName}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">Titular</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{donateData.bank.name}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12 text-slate-400 text-sm italic"
                >
                    "Cualquier aportación, por pequeña que sea, ayuda muchísimo a mantener vivo este proyecto."
                </motion.p>
            </div>
        </div>
    );
};

export default DonationPage;
