import React from 'react';
import type { Goal } from '../api/services';
import { Trash2, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

interface GoalCardProps {
    goal: Goal;
    progress: number; // 0 to 100
    currentAmount: number;
    onDelete: (id: string) => void;
    onAddPayment: (goal: Goal) => void;
    onEdit?: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, progress, currentAmount, onDelete, onAddPayment }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)" }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 relative overflow-hidden group cursor-pointer"
            onClick={() => navigate(`/goals/${goal.id}`)}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1 tracking-tight">{goal.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{goal.description}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }} className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all duration-200">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 text-slate-600 font-medium">
                    <span>Progreso</span>
                    <span className="text-blue-600 font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    ></motion.div>
                </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-50 pt-5">
                <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ahorrado</p>
                    <p className="text-2xl font-bold text-slate-800">${currentAmount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Meta</p>
                    <p className="text-2xl font-bold text-slate-800">${goal.target.toFixed(2)}</p>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onAddPayment(goal); }}
                className="w-full mt-6 py-3 bg-slate-50 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-200 border border-slate-200 hover:border-blue-200 group-hover:shadow-sm"
            >
                <PlusCircle size={20} /> Agregar Pago
            </button>
        </motion.div>
    );
};

export default GoalCard;
