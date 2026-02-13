import { Button } from "@/components/Button";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { TransactionType } from "@/components/TransactionType";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StatusBar, View } from "react-native";

export default function Transaction() {
    const transactionDB = useTransactionsDatabase()
    const params = useLocalSearchParams<{ id: string }>()

    const [type, setType] = useState<TransactionTypes>(TransactionTypes.INCOME)
    const [isCreating, setIsCreating] = useState(false)
    const [amount, setAmount] = useState(0)
    const [observation, setObservation] = useState("")

    async function handleCreate() {
        try {
            if (amount <= 0) {
                return Alert.alert("Atenção!", "O valor da transação deve ser maior que zero.")
            }

            setIsCreating(true)

            await transactionDB.create({
                target_id: Number(params.id),
                amount: type === TransactionTypes.INCOME ? amount : amount * -1,
                observation
            })
            Alert.alert("Sucesso", "Transação criada com sucesso!", [
                {
                    text: "OK", onPress: () => {
                        setAmount(0)
                        setObservation("")
                        router.back()
                    }
                }
            ])
        } catch (error) {
            Alert.alert("Ops", "Não foi possível criar a transação. Tente novamente mais tarde. Error: " + error)
            console.log(error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <StatusBar barStyle="light-content" />
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
                    value={amount}
                    onChangeValue={setAmount}
                    label="Valor (R$)"
                />

                <Input
                    label="Motivo (opcional)"
                    placeholder="Ex: Investir em CDB de 110% no banco XPTO"
                    value={observation}
                    onChangeText={setObservation}
                />

                <Button
                    title="Salvar"
                    onPress={handleCreate}
                    isProcessing={isCreating}
                />
            </View>
        </View>
    )
}