import React, { useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { GoalService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface CreateGoalModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            await GoalService.create({
                user_id: user.id,
                name,
                description,
                target: parseFloat(target),
                startDate: startDate || new Date().toISOString().split('T')[0],
                endDate: endDate || new Date().toISOString().split('T')[0], // Default to today/future
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create goal', error);
            alert('Failed to create goal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative border border-gray-100"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <ShoppingBag size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Nueva Meta</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Meta</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="ej. Nueva Laptop" required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field" rows={3} placeholder="¿Para qué estás ahorrando?" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Monto Meta ($)</label>
                        <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="input-field" min="1" step="0.01" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Inicio</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Fin</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" required />
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full btn-primary mt-6 py-3 font-bold text-lg">
                        {loading ? 'Creando...' : 'Crear Meta'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateGoalModal;
