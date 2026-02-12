import { Button } from "@/components/Button";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { TransactionType } from "@/components/TransactionType";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Transaction() {
    const params = useLocalSearchParams<{id:string}>()
    const [type, setType] = useState<TransactionTypes>(TransactionTypes.INCOME)
    return (
        <View style={{ flex:1, padding: 24 }}>
            <PageHeader
                title="Nova transação"
                subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
            />

            <View style={{ marginTop: 32, gap: 24 }}>
                <TransactionType 
                    selected={type}
                    onChange={setType}
                />
                <CurrencyInput
                    value={0}
                    label="Valor (R$)"
                />

                <Input
                    label="Motivo (opcional)"
                    placeholder="Ex: Investir em CDB de 110% no banco XPTO"
                />

                <Button
                    title="Salvar"
                />
            </View>
        </View>
    )
}