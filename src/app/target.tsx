import { Button } from "@/components/Button";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function Target() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);

    const params = useLocalSearchParams<{id?:string}>();
    const targetDB = useTargetDatabase();

    function handleSave() {
        if (!name.trim() || amount <= 0) {
            Alert.alert("Atenção", "Preencha nome e valor.");
            return;
        }
        setIsProcessing(true);

        if(params.id) {
            // TODO: update target
        } else {
            create();
        }
    }

    async function create() {
        try {
            await targetDB.create({ name, amount });

            Alert.alert("Nova meta", "Meta criada com sucesso!", [
                {
                    text: "OK",
                    onPress: () => {
                        setName("");
                        setAmount(0);
                        router.back();
                    }
                }
            ]);
        } catch (error) {
            Alert.alert("Ops", "Não foi possível criar a meta. Error: " + error);
            setIsProcessing(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 24 }}> 
            <PageHeader title="Meta" subtitle="Economize para..."/>

            <View style={{ marginTop: 32, gap: 24 }}>
                <Input 
                    label="Nome da meta" 
                    placeholder="Ex: Viagem para praia, Apple Watch..."
                    value={name}
                    onChangeText={setName}
                />

                <CurrencyInput 
                    label="Valor alvo (R$)" 
                    value={amount}
                    onChangeValue={setAmount}
                    placeholder="Ex: R$ 1.000,00"
                />

                <Button title="Salvar" onPress={handleSave} isProcessing={isProcessing}/>
            </View>
        </View>
    )
}