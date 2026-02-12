import { HomeHeader } from "@/components/HomeHeader";
import { Target } from "@/components/Target";
import { View } from "react-native";

const summary = {
    total: 'R$ 2.600,00',
    input: { label: 'Entradas', value: 'R$6983,67' },
    output: { label: 'Saídas', value: '-R$6983,67' }
}

const targets = [
    {
        name: 'Teste',
        current: 'R$900,00',
        target: 'R$1200,00',
        percentage: '75%'
    }
]

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <HomeHeader data={summary} />
            <Target data={targets[0]} />
        </View>
    )
}