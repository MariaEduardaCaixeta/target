import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";
import { List } from "@/components/List";
import { Transaction, TransactionProps } from "@/components/Transaction";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { Button } from "@/components/Button";
import { TargetResponse, useTargetDatabase } from "@/database/useTargetDatabase";
import { useCallback, useState } from "react";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { Loading } from "@/components/Loading";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import dayjs from "dayjs";

export default function InProgress() {
    const params = useLocalSearchParams<{ id: string }>()
    const targetDB = useTargetDatabase()
    const transactionsDB = useTransactionsDatabase()

    const [targetDetails, setTargetDetails] = useState({
        name: "",
        current: "R$ 0,00",
        target: "R$ 0,00",
        percentage: 0
    })
    const [isFetching, setIsFetching] = useState(true)
    const [transactions, setTransactions] = useState<TransactionProps[]>([])

    async function fetchTargetDetails() {
        try {
            const details = await targetDB.show(Number(params.id))
            setTargetDetails({
                name: details.name,
                current: numberToCurrency(details.current),
                target: numberToCurrency(details.amount),
                percentage: details.percentage
            })
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os detalhes do alvo. Error: " + error.message)
            console.error("Error fetching target details:", error)
        }
    }

    async function fetchTransactions() {
        try {
            const transactions = await transactionsDB.listByTargetId(Number(params.id))
            setTransactions(
                transactions.map((transaction) => ({
                    id: String(transaction.id),
                    type: transaction.amount > 0 ? TransactionTypes.INCOME : TransactionTypes.EXPENSE,
                    value: numberToCurrency(transaction.amount),
                    description: transaction.observation,
                    date: dayjs(transaction.created_at).format("DD/MM/YYYY [às] HH:mm:ss")
                })))

        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar as transações. Error: " + error.message)
            console.error("Error fetching transactions:", error)
        }
    }

    async function fetchData() {
        const fetchDetailsPromise = fetchTargetDetails()
        const fetchTransactionsPromise = fetchTransactions()

        await Promise.all([fetchDetailsPromise, fetchTransactionsPromise])
        setIsFetching(false)
    }

    async function removeTransaction(id: string) {
        try {
            await transactionsDB.remove(Number(id))
            fetchData()
            Alert.alert("Sucesso", "Transação removida com sucesso.")
        } catch (error) {
            Alert.alert("Erro", "Não foi possível remover a transação. Error: " + error.message)
            console.error("Error removing transaction:", error)
        }
    }

    function handleRemoveTransaction(id: string) {
        Alert.alert(
            "Confirmação",
            "Tem certeza que deseja remover esta transação?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        removeTransaction(id)
                    }
                }
            ]
        )

    }

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    )

    if (isFetching) {
        return <Loading />
    }

    return (
        <View style={{ flex: 1, padding: 24, gap: 32, }}>
            <PageHeader
                title={targetDetails.name}
                rightButton={{
                    icon: 'edit',
                    onPress: () => router.navigate(`/target?id=${params.id}`)
                }}
            />

            <Progress
                data={targetDetails}
            />

            <List
                title="Transações"
                data={transactions}
                renderItem={({ item }) => (
                    <Transaction
                        data={item}
                        onRemove={() => handleRemoveTransaction(item.id)}
                    />
                )}
                emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
            />

            <Button
                title="Nova transação"
                onPress={() => router.navigate(`/transaction/${params.id}`)}
            />

        </View>
    )
}