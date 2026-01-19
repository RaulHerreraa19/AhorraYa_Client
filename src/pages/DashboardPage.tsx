import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoalService, PaymentService, type Goal, type PaymentRecord } from '../api/services';
import GoalCard from '../components/GoalCard';
import CreateGoalModal from '../components/CreateGoalModal';
import AddPaymentModal from '../components/AddPaymentModal';
import { Plus, Layout, Heart } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { motion } from 'framer-motion';

const MySwal = withReactContent(Swal);

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [paymentModalGoal, setPaymentModalGoal] = useState<Goal | null>(null);

    // Map to store current amount per goal
    const [goalProgress, setGoalProgress] = useState<Record<string, number>>({});

    const fetchGoals = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await GoalService.getByUserId(user.id);
            if (response.result && Array.isArray(response.result)) {
                const fetchedGoals = response.result;
                setGoals(fetchedGoals);

                const progressMap: Record<string, number> = {};
                await Promise.all(fetchedGoals.map(async (goal: Goal) => {
                    try {
                        const recordsResponse = await PaymentService.getByGoalId(goal.id);

                        // Handle different response structures gracefully
                        // Service now normalizes to { data: PaymentRecord[] } or just array in some fallback
                        let records: PaymentRecord[] = [];

                        if (recordsResponse && Array.isArray(recordsResponse.data)) {
                            records = recordsResponse.data;
                        } else if (recordsResponse && Array.isArray(recordsResponse)) {
                            records = recordsResponse;
                        }

                        if (records.length > 0) {
                            const total = records.reduce((sum: number, r: PaymentRecord) => sum + Number(r.amount), 0);
                            progressMap[goal.id] = total;
                        } else {
                            progressMap[goal.id] = 0;
                        }
                    } catch (e) {
                        console.error(`Failed to fetch records for goal ${goal.id}`, e);
                        progressMap[goal.id] = 0;
                    }
                }));
                setGoalProgress(progressMap);
            }
        } catch (error) {
            console.error('Failed to fetch goals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [user]);

    const handleDelete = async (id: string) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await GoalService.delete(id);
                fetchGoals();
                MySwal.fire(
                    'Deleted!',
                    'Your goal has been deleted.',
                    'success'
                )
            }
        })
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 relative">
            {/* Subtle Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Objetivos</h1>
                        <p className="text-slate-500 font-medium">Bienvenido, {user?.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/donations')} className="hidden md:flex items-center gap-2 px-4 py-2.5 text-red-500 hover:text-red-600 font-bold transition-all bg-red-50 hover:bg-red-100 rounded-xl border border-red-100">
                        <Heart size={18} fill="currentColor" /> Donar
                    </button>
                    <button onClick={handleLogout} className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-medium transition-colors bg-white/50 hover:bg-white rounded-xl border border-transparent hover:border-slate-200">
                        Cerrar Sesión
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2 py-3 px-6 shadow-blue-300/50">
                        <Plus size={20} /> <span className="font-semibold">Nueva Meta</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto relative z-10">
                {loading ? (
                    <div className="flex justify-center mt-24"><div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div></div>
                ) : goals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-100 shadow-sm"
                    >
                        <div className="bg-slate-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Plus size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Aún no hay metas</h3>
                        <p className="text-slate-500 mb-10 max-w-xs mx-auto text-lg leading-relaxed">Crea tu primera meta de ahorro y comienza a seguir tu progreso hoy.</p>
                        <button onClick={() => setShowCreateModal(true)} className="btn-primary text-lg px-8 py-3">Crear Meta</button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {goals.map(goal => {
                            const current = goalProgress[goal.id] || 0;
                            const progress = goal.target > 0 ? (current / goal.target) * 100 : 0;
                            return (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    currentAmount={current}
                                    progress={progress}
                                    onDelete={handleDelete}
                                    onAddPayment={(g) => setPaymentModalGoal(g)}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            {showCreateModal && <CreateGoalModal onClose={() => setShowCreateModal(false)} onSuccess={fetchGoals} />}
            {paymentModalGoal && <AddPaymentModal goal={paymentModalGoal} onClose={() => setPaymentModalGoal(null)} onSuccess={fetchGoals} />}
        </div>
    );
};

export default Dashboard;
