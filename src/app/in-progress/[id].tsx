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

const transactions: TransactionProps[] = [
    {
        id: "1",
        value: "R$ 500,00",
        date: "01/01/2024",
        description: "Salário",
        type: TransactionTypes.INCOME
    },
    {
        id: "2",
        value: "R$ 200,00",
        date: "02/01/2024",
        description: "Aluguel",
        type: TransactionTypes.EXPENSE
    },
]

export default function InProgress() {
    const params = useLocalSearchParams<{ id: string }>()
    const targetDB = useTargetDatabase()

    const [targetDetails, setTargetDetails] = useState({
        name: "",
        current: "R$ 0,00",
        target: "R$ 0,00",
        percentage: 0
    })
    const [isFetching, setIsFetching] = useState(true)

    async function fetchDetails() {
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

    async function fetchData() {
        const fetchDetailsPromise = fetchDetails()

        await Promise.all([fetchDetailsPromise])
        setIsFetching(false)
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
                        onRemove={() => { }}
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