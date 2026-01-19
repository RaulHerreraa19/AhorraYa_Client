import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import { PaymentService, type PaymentRecord } from '../api/services';
import { motion } from 'framer-motion';

interface EditPaymentModalProps {
    startPayment: PaymentRecord;
    onClose: () => void;
    onSuccess: () => void;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ startPayment, onClose, onSuccess }) => {
    const [amount, setAmount] = useState(startPayment.amount.toString());
    const [date, setDate] = useState(startPayment.date);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await PaymentService.update({
                id: startPayment.id,
                amount: parseFloat(amount),
                date,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update payment', error);
            alert('Failed to update payment');
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
                        <h2 className="text-xl font-bold text-gray-800">Editar Pago</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="input-field mb-4"
                            required
                        />
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Monto ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-3xl font-bold text-center placeholder-gray-300"
                            min="1"
                            step="0.01"
                            required
                        />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-200 mt-2">
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditPaymentModal;
