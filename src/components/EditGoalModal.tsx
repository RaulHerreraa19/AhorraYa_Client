import React, { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { GoalService, type Goal } from '../api/services';
import { motion } from 'framer-motion';

interface EditGoalModalProps {
    goal: Goal;
    onClose: () => void;
    onSuccess: () => void;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ goal, onClose, onSuccess }) => {
    const [name, setName] = useState(goal.name);
    const [description, setDescription] = useState(goal.description);
    const [target, setTarget] = useState(goal.target.toString());
    const [startDate, setStartDate] = useState(goal.startDate);
    const [endDate, setEndDate] = useState(goal.endDate);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(goal.name);
        setDescription(goal.description);
        setTarget(goal.target.toString());
        setStartDate(goal.startDate);
        setEndDate(goal.endDate);
    }, [goal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await GoalService.updateDetails({
                ...goal,
                name,
                description,
                target: parseFloat(target),
                startDate,
                endDate,
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to update goal', error);
            alert('Failed to update goal');
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
                    <h2 className="text-xl font-bold text-gray-800">Editar Meta</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Meta</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field" rows={3} />
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
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditGoalModal;
