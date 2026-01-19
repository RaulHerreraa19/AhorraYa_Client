import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoalService, PaymentService, type Goal, type PaymentRecord } from '../api/services';
import { ArrowLeft, Edit2, Trash2, Calendar, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AddPaymentModal from '../components/AddPaymentModal';
import EditGoalModal from '../components/EditGoalModal';
import EditPaymentModal from '../components/EditPaymentModal';

const MySwal = withReactContent(Swal);

const GoalDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [goal, setGoal] = useState<Goal | null>(null);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false);
    const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
    const [user, setUser] = useState<any>(null); // Quick fix to get user ID if needed, though id is from params

    useEffect(() => {
        // Hydrate user
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    const fetchData = async () => {
        if (!id || !user) return;
        setLoading(true);
        try {
            // Re-fetch all goals to find the specific one (as getByUserId returns all)
            // Ideally we'd have a getGoalById endpoint but this works for now
            const response = await GoalService.getByUserId(user.id);
            const foundGoal = response.result?.find((g: Goal) => g.id === id);

            if (foundGoal) {
                setGoal(foundGoal);
                const recordsRes = await PaymentService.getByGoalId(id);
                // Handle response structure logic same as Dashboard
                // Service now normalizes to { data: PaymentRecord[] }
                let records: PaymentRecord[] = [];
                if (recordsRes && Array.isArray(recordsRes.data)) records = recordsRes.data;
                else if (recordsRes && Array.isArray(recordsRes)) records = recordsRes;

                setPayments(records);
            } else {
                // Goal not found or user not authorized
                alert("Meta no encontrada");
                navigate('/dashboard');
            }

        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, user]);

    const handleDeletePayment = async (paymentId: string) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await PaymentService.delete(paymentId);
                fetchData();
                MySwal.fire('¡Eliminado!', 'El pago ha sido eliminado.', 'success');
            }
        });
    };

    if (loading || !goal) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    const totalSaved = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const progress = (totalSaved / goal.target) * 100;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium">
                    <ArrowLeft size={20} className="mr-2" /> Volver al Panel
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{goal.name}</h1>
                                <p className="text-blue-100 text-lg opacity-90">{goal.description}</p>
                            </div>
                            <button onClick={() => setShowEditGoal(true)} className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center transition-all font-medium border border-white/30">
                                <Edit2 size={16} className="mr-2" /> Editar Meta
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold mb-1">Meta Total</p>
                                <p className="text-2xl font-bold">${goal.target.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold mb-1">Ahorrado</p>
                                <p className="text-2xl font-bold">${totalSaved.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold mb-1">Restante</p>
                                <p className="text-2xl font-bold">${Math.max(0, goal.target - totalSaved).toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-blue-100 text-xs uppercase tracking-wider font-semibold mb-1">Progreso</p>
                                <p className="text-2xl font-bold">{progress.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Historial de Pagos</h2>
                            <button onClick={() => setShowAddPayment(true)} className="text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center">
                                <Plus size={18} className="mr-1" /> Agregar Pago
                            </button>
                        </div>

                        {payments.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                <Calendar size={48} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-slate-500 font-medium">No hay pagos registrados aún.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                                            <th className="text-left py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Monto</th>
                                            <th className="text-right py-4 px-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map(payment => (
                                            <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                                <td className="py-4 px-4 text-slate-700 font-medium">
                                                    {new Date(payment.date).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-slate-900 font-bold">
                                                    ${parseFloat(payment.amount.toString()).toLocaleString()}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button onClick={() => setEditingPayment(payment)} className="text-slate-400 hover:text-blue-600 p-2 transition-colors">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeletePayment(payment.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors ml-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAddPayment && <AddPaymentModal goal={goal} onClose={() => setShowAddPayment(false)} onSuccess={fetchData} />}
            {showEditGoal && <EditGoalModal goal={goal} onClose={() => setShowEditGoal(false)} onSuccess={fetchData} />}
            {editingPayment && <EditPaymentModal startPayment={editingPayment} onClose={() => setEditingPayment(null)} onSuccess={fetchData} />}
        </div>
    );
};

export default GoalDetails;
