import { HomeHeader } from "@/components/HomeHeader";
import { List } from "@/components/List";
import { Target } from "@/components/Target";
import { View } from "react-native";

const summary = {
    total: 'R$ 2.600,00',
    input: { label: 'Entradas', value: 'R$6983,67' },
    output: { label: 'Saídas', value: '-R$6983,67' }
}

const targets = [
    {
        id: '1',
        name: 'Teste',
        current: 'R$900,00',
        target: 'R$1200,00',
        percentage: '75%'
    },
    {
        id: '2',
        name: '2',
        current: 'R$900,00',
        target: 'R$1200,00',
        percentage: '75%'
    },
]

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <HomeHeader data={summary} />
            <List 
                title='Metas'
                data={targets} 
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <Target data={item} />}
                emptyMessage="Nenhuma meta. Clique em nova meta para criar"
                containerStyle={{paddingHorizontal: 24}}
            />
        </View>
    )
}