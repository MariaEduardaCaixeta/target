import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { List } from "@/components/List";
import { Transaction, TransactionProps } from "@/components/Transaction";
import { TransactionTypes } from "@/utils/TransactionTypes";

const details = {
    current: "R$ 1.500,00",
    target: "R$ 3.000,00",
    percentage: 50,
}

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

    return (
        <View style={{ flex: 1, padding: 24, gap: 32, }}>
            <PageHeader
                title="Apple Watch"
                rightButton={{
                    icon: 'edit',
                    onPress: () => { }
                }}
            />

            <Progress
                data={details}
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
            />

        </View>
    )
}