import { useFetch } from '@/hooks/useFetch';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { stylesApi } from '../styles/apiStyles';

export default function ApiScreen() {
    interface ZeldaGame {
        id: string;
        name: string;
        description: string;
        developer: string;
        publisher: string;
        released_date: string;
    }

    interface ZeldaResponse {
        data: ZeldaGame[];
    }

    const [page, setPage] = useState(1);
    const { data, loading, error } = useFetch<ZeldaResponse>(`https://zelda.fanapis.com/api/games?page=${page}`);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(true);

    const filteredGames = data?.data
        ?.filter((game) =>
            game.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        )
        .slice(0, 1) ?? []; // Mostrar 5 por página

    const handleNext = () => setPage((prev) => prev + 1);
    const handlePrevious = () => setPage((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <View style={stylesApi.container}>
            <View style={stylesApi.card}>
                <Text style={stylesApi.title}>Juegos de The Legend of Zelda</Text>

                <View style={stylesApi.searchSortContainer}>
                    <TextInput
                        style={stylesApi.searchInput}
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity
                        onPress={() => setSortAsc((prev) => !prev)}
                        style={stylesApi.sortButton}
                    >
                        <MaterialIcons
                            name={sortAsc ? 'arrow-downward' : 'arrow-upward'}
                            size={24}
                            color="#007AFF"
                        />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" />
                ) : error ? (
                    <Text style={{ padding: 10, color: 'red' }}>Error: {error.message}</Text>
                ) : (
                    <FlatList
                        data={filteredGames}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={stylesApi.tableRow}>
                                <Text style={stylesApi.cellTitle}>{item.name}</Text>
                                <Text style={stylesApi.cell}>🎮 Desarrollador: {item.developer}</Text>
                                <Text style={stylesApi.cell}>🏢 Publicado por: {item.publisher}</Text>
                                <Text style={stylesApi.cell}>📅 Lanzamiento: {item.released_date}</Text>
                                <Text style={stylesApi.cell}>📝 {item.description}</Text>
                            </View>
                        )}


                        ListFooterComponent={
                            <View style={[stylesApi.pagination, { marginBottom: 20 }]}>
                                <TouchableOpacity onPress={handlePrevious} style={stylesApi.pageButton}>
                                    <Text style={stylesApi.pageText}>Anterior</Text>
                                </TouchableOpacity>
                                <Text style={stylesApi.pageText}>Página {page}</Text>
                                <TouchableOpacity onPress={handleNext} style={stylesApi.pageButton}>
                                    <Text style={stylesApi.pageText}>Siguiente</Text>
                                </TouchableOpacity>
                            </View>

                        }
                        contentContainerStyle={{ paddingBottom: 100 }} // 👈 Añade espacio al final

                    />

                )}
            </View>

        </View>

    );
}
