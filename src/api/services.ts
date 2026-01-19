import api from './axios';

export interface Goal {
    id: string; // Backend uses UUID
    name: string;
    description: string; // Backend doesn't have this, we'll handle it gracefully
    target: number;
    currentAmount: number;
    startDate: string;
    endDate: string;
    status: string;
}

export interface PaymentRecord {
    id: string;
    amount: number;
    date: string;
    saving_id: string;
}

export const GoalService = {
    getByUserId: async (userId: number) => {
        const response = await api.get(`/savings/${userId}`);
        // Backend returns { typeOfResponse: 'SUCCESS', data: savingGoalDTO[], message: ... }
        if (response.data.typeOfResponse === 'SUCCESS' || response.data.typeOfResponse === 0 || response.data.typeOfResponse === '0') {
            const backendGoals = response.data.data;
            const mappedGoals: Goal[] = backendGoals.map((g: any) => ({
                id: g.id,
                name: g.title,
                description: '', // Backend doesn't store description
                target: typeof g.targetAmount === 'string' ? parseFloat(g.targetAmount) : g.targetAmount,
                currentAmount: 0, // Calculated separately
                startDate: g.startDate,
                endDate: g.endDate,
                status: g.status
            }));
            return { result: mappedGoals };
        }
        return { result: [] };
    },
    create: async (data: Omit<Goal, 'id' | 'currentAmount' | 'status'> & { user_id: number }) => {
        const payload = {
            userId: data.user_id,
            title: data.name,
            targetAmount: data.target,
            startDate: data.startDate,
            endDate: data.endDate
        };
        const response = await api.post('/savings/create', payload);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/savings/${id}`);
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await api.post('/savings/update', { id, status });
        return response.data;
    },
    updateDetails: async (data: Goal) => {
        const payload = {
            id: data.id,
            title: data.name,
            targetAmount: data.target,
            startDate: data.startDate,
            endDate: data.endDate
        };
        const response = await api.post('/savings/update-details', payload);
        return response.data;
    }
};

export const PaymentService = {
    getByGoalId: async (goalId: string) => {
        const response = await api.get(`/records?goalId=${goalId}`);
        // Map backend response if needed, but assuming backend returns `recordDate`.
        // We defined PaymentRecord with `date`. We should map it.
        const data = response.data;
        // Handle varied response structure
        let records: any[] = [];
        if (data && Array.isArray(data.data)) records = data.data;
        else if (data && Array.isArray(data.result)) records = data.result;
        else if (data && Array.isArray(data)) records = data;

        const mappedRecords = records.map((r: any) => ({
            id: r.id,
            amount: r.amount,
            date: r.recordDate || r.date, // Map recordDate to date
            saving_id: r.goalId
        }));

        return { data: mappedRecords }; // standardized return
    },
    create: async (data: { amount: number; saving_id: string; date?: string }) => {
        const payload = {
            goalId: data.saving_id,
            amount: data.amount,
            recordDate: data.date || new Date().toISOString(),
            source: 'manual'
        };
        const response = await api.post('/records', payload);
        return response.data;
    },
    update: async (data: { id: string, amount: number, date: string }) => {
        const payload = {
            id: data.id,
            amount: data.amount,
            recordDate: data.date
        };
        const response = await api.post('/records/update', payload);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/records/${id}`);
        return response.data;
    }
};
