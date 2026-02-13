import { useSQLiteContext } from "expo-sqlite";

export type TransactionCreateData = {
    target_id: number;
    amount: number;
    observation?: string;
}

export type TransactionResponse = {
    id: number;
    target_id: number;
    amount: number;
    observation: string;
    created_at: Date;
    updated_at: Date;
}

export function useTransactionsDatabase() {
    const database = useSQLiteContext();

    async function create(data: TransactionCreateData) {
        const statement = await database.prepareAsync(`
            INSERT INTO transactions (target_id, amount, observation) 
            VALUES 
            ($target_id, $amount, $observation)
        `)

        statement.executeAsync({
            $target_id: data.target_id,
            $amount: data.amount,
            $observation: data.observation
        })
    }

    function listByTargetId(target_id: number) {
        return database.getAllAsync<TransactionResponse>(`
            SELECT id, target_id, amount, observation, created_at, updated_at
            FROM transactions
            WHERE target_id = $target_id
            ORDER BY created_at DESC
        `, {
            $target_id: target_id
        })
    }

    async function remove(id: number) {
        await database.runAsync("DELETE FROM transactions WHERE id = ?", id)
    }

    return {
        create,
        listByTargetId,
        remove
    }
}