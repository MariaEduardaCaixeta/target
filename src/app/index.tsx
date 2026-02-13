import { Button } from "@/components/Button";
import { HomeHeader, HomeHeaderProps } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { Loading } from "@/components/Loading";
import { Target, TargetProps } from "@/components/Target";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, StatusBar, Alert } from "react-native";

export default function Index() {
    const targetDB = useTargetDatabase();
    const transactionsDB = useTransactionsDatabase();

    const [isFetching, setIsFetching] = useState(true);
    const [targets, setTargets] = useState<TargetProps[]>([]);
    const [summary, setSummary] = useState<HomeHeaderProps>()

    async function fetchTargets(): Promise<TargetProps[]> {
        try {   
            const response = await targetDB.listBySavedValue();

            return response.map(item => ({
                id: String(item.id),
                name: item.name,
                current: numberToCurrency(item.current),
                percentage: item.percentage.toFixed(0) + "%",
                target: numberToCurrency(item.amount)
            }))
        } catch (error) {
            Alert.alert("Ops", "Não foi possível carregar as metas. Error: " + error);
            console.error("Error fetching targets: ", error);
        }
    }

    async function fetchSummary(): Promise<HomeHeaderProps> {
        try {
            const response = await transactionsDB.summary();
            
            return {
                total: numberToCurrency(response.income + response.expense),
                input: {
                    label: "Entradas",
                    value: numberToCurrency(response.income)
                },
                output: {
                    label: "Saídas",
                    value: numberToCurrency(response.expense)   
                }
            }
        } catch (error) {
            Alert.alert("Ops", "Não foi possível carregar o resumo. Error: " + error);
            console.error("Error fetching summary: ", error);
        }
    }

    async function fetchData() {
        const targetDataPromise = fetchTargets();
        const summaryDataPromise = fetchSummary();

        const [targetData, summaryData] = await Promise.all([targetDataPromise, summaryDataPromise]);
        setTargets(targetData);
        setSummary(summaryData);
        setIsFetching(false);
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    )

    if(isFetching) {
        return <Loading />
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <HomeHeader data={summary} />
            <List
                title='Metas'
                data={targets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Target data={item} onPress={() => router.navigate(`/in-progress/${item.id}`)}/>}
                emptyMessage="Nenhuma meta. Clique em nova meta para criar"
                containerStyle={{ paddingHorizontal: 24 }}
            />

            <View style={{ padding: 24, paddingBottom: 32 }}>
                <Button
                    title="Nova meta"
                    onPress={() => router.navigate("/target")}
                />
            </View>

        </View>
    )
}