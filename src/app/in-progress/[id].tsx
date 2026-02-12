import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const details = {
    current: "R$ 1.500,00",
    target: "R$ 3.000,00",
    percentage: 50,
}

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

        </View>
    )
}