import { Button } from "@/components/Button";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StatusBar, View } from "react-native";

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
            update();
        } else {
            create();
        }
    }

    async function update() {
        try {
            await targetDB.update({
                id: Number(params.id),
                name,
                amount
            });

            Alert.alert("Sucesso!", "Meta atualizada com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.back()
                }
            ]);
        } catch (error) {
            Alert.alert("Ops", "Não foi possível atualizar a meta. Error: " + error);
            setIsProcessing(false);
        }
    }

    async function create() {
        try {
            await targetDB.create({ name, amount });

            Alert.alert("Sucesso!", "Meta criada com sucesso!", [
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

    async function fetchDetails(id: number) {
        try {
            const details = await targetDB.show(id);
            setName(details.name);
            setAmount(details.amount);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os detalhes da meta. Error: " + error.message);
            console.error("Error fetching target details:", error);
        }
    }

    function handleRemove() {
        Alert.alert("Remover", "Tem certeza que deseja remover essa meta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Remover",
                style: "destructive",
                onPress: remove
            }
        ]);
    }

    async function remove() {
        try {
            setIsProcessing(true);
            await targetDB.remove(Number(params.id));

            Alert.alert("Sucesso!", "Meta removida com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/")
                }
            ]);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível remover a meta. Error: " + error.message);
            console.error("Error removing target:", error);
            setIsProcessing(false);
        }
    }

    useEffect(() => {
        if (params.id) {
            fetchDetails(Number(params.id));
        }
    }, [params.id])

    return (
        <View style={{ flex: 1, padding: 24 }}> 
            <StatusBar barStyle="dark-content" />
            <PageHeader 
                title="Meta" 
                subtitle="Economize para alcançar sua meta financeira."
                rightButton={
                    params.id ? { icon: "delete", onPress: handleRemove } : undefined
                }
            />

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