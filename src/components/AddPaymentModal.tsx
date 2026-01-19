import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import { PaymentService, type Goal } from '../api/services';
import { motion } from 'framer-motion';

interface AddPaymentModalProps {
    goal: Goal;
    onClose: () => void;
    onSuccess: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ goal, onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await PaymentService.create({
                amount: parseFloat(amount),
                saving_id: goal.id,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to add payment', error);
            alert('Failed to add payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Agregar Pago</h2>
                        <p className="text-sm text-gray-500">para {goal.name}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Monto ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-3xl font-bold text-center placeholder-gray-300"
                            min="1"
                            step="0.01"
                            placeholder="0.00"
                            required
                            autoFocus
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-200 mt-2">
                        {loading ? 'Procesando...' : 'Confirmar Pago'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddPaymentModal;
