import { useSQLiteContext } from "expo-sqlite";


export type TargetCreateData = {
    name: string;
    amount: number;
}

export type TargetUpdateData = TargetCreateData & {
    id: number;
}

export type TargetResponse = {
    id: number;
    name: string;
    amount: number;
    current: number;
    percentage: number;
    created_at: Date;
    updated_at: Date;
}

export function useTargetDatabase() {
    const database = useSQLiteContext();

    async function create(data: TargetCreateData) {
        const statement = await database.prepareAsync(
            "INSERT INTO targets (name, amount) VALUES ($name, $amount)"
        )

        statement.executeAsync({
            $name: data.name,
            $amount: data.amount
        })
    }

    function listBySavedValue() {
        return database.getAllAsync<TargetResponse>(`
            SELECT 
                targets.id,
                targets.name,
                targets.amount,
                COALESCE(SUM(transactions.amount), 0) AS current,
                COALESCE(SUM(transactions.amount) * 100.0 / targets.amount, 0) AS percentage,
                targets.created_at,
                targets.updated_at
            FROM targets 
            LEFT JOIN transactions ON transactions.target_id = targets.id
            GROUP BY targets.id, targets.name, targets.amount, targets.created_at, targets.updated_at
            ORDER BY current DESC
        `)
    }

    function show(id: number) {
        return database.getFirstAsync<TargetResponse>(`
            SELECT 
                targets.id,
                targets.name,
                targets.amount,
                COALESCE(SUM(transactions.amount), 0) AS current,
                COALESCE(SUM(transactions.amount) * 100.0 / targets.amount, 0) AS percentage,
                targets.created_at,
                targets.updated_at
            FROM targets 
            LEFT JOIN transactions ON transactions.target_id = targets.id
            WHERE targets.id = ${id}
        `)
    }

    async function update(data: TargetUpdateData) {
        const statement = await database.prepareAsync(`
            UPDATE targets SET
                name = $name,
                amount = $amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $id  
        `)

        await statement.executeAsync({
            $id: data.id,
            $name: data.name,
            $amount: data.amount
        })
    }

    async function remove(id: number) {
        await database.runAsync(`DELETE FROM targets WHERE id = ?`, id)
    }
    return {
        create,
        listBySavedValue,
        show,
        update,
        remove
    }
}