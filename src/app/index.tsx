import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <Text>Olá, Expo Router</Text>

            <Button title="Target" onPress={() => router.navigate('target')}/>
                <Button title="Transaction" onPress={() => router.navigate('/transaction/132')}/>
        </View>
    )
}