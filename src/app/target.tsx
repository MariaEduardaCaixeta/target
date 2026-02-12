import { Button } from "@/components/Button";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { View } from "react-native";

export default function Target() {
    return (
        <View style={{ flex: 1, padding: 24 }}> 
            <PageHeader title="Meta" subtitle="Economize para..."/>

            <View style={{ marginTop: 32, gap: 24 }}>
                <Input 
                    label="Nome da meta" 
                    placeholder="Ex: Viagem para praia, Apple Watch..."
                />

                <CurrencyInput 
                    label="Valor alvo (R$)" 
                    value={0}
                    placeholder="Ex: R$ 1.000,00"
                />

                <Button title="Salvar"/>
            </View>
        </View>
    )
}