import { useFetch } from '@/hooks/useFetch';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { stylesApi } from '../styles/apiStyles';

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

export default function ApiScreen() {
    const { data, loading, error } = useFetch<ZeldaResponse>('https://zelda.fanapis.com/api/games');
    const games = data?.data || [];

    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState<ZeldaGame | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredGames = games
        .filter((game) =>
            game.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortAsc
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );

    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    const paginatedGames = filteredGames.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openModal = (game: ZeldaGame) => {
        setSelectedGame(game);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedGame(null);
        setModalVisible(false);
    };

    const renderItem = ({ item }: { item: ZeldaGame }) => (
        <TouchableOpacity onPress={() => openModal(item)}>
            <View style={stylesApi.row}>
                <Text style={stylesApi.cell}>{item.name}</Text>
                <Text style={stylesApi.cell}>{item.publisher}</Text>
                <Text style={stylesApi.cell}>{item.released_date}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={stylesApi.container}>
            {/* Tabla */}
            <View style={stylesApi.table}>
                <Text style={stylesApi.text}>Juegos de Zelda</Text>

                {/* Buscador y ordenamiento */}
                <View style={stylesApi.searchSortContainer}>
                    <TextInput
                        style={stylesApi.searchInput}
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChangeText={(text) => {
                            setSearchTerm(text);
                            setCurrentPage(1); // Reiniciar a la primera página al buscar
                        }}
                    />
                    <TouchableOpacity onPress={() => setSortAsc((prev) => !prev)} style={stylesApi.sortButton}>
                        <MaterialIcons name={sortAsc ? 'arrow-downward' : 'arrow-upward'} size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={stylesApi.tableHeader}>
                    <Text style={[stylesApi.cell, stylesApi.headerCell]}>Nombre</Text>
                    <Text style={[stylesApi.cell, stylesApi.headerCell]}>Compañía</Text>
                    <Text style={[stylesApi.cell, stylesApi.headerCell]}>Lanzamiento</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
                ) : error ? (
                    <Text style={stylesApi.errorText}>Error al cargar los datos</Text>
                ) : (
                    <>
                        <FlatList
                            data={paginatedGames}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />

                        {/* Controles de paginación */}
                        <View style={stylesApi.paginationContainer}>
                            <TouchableOpacity
                                style={[stylesApi.pageButton, currentPage === 1 && stylesApi.disabledButton]}
                                disabled={currentPage === 1}
                                onPress={() => setCurrentPage((prev) => prev - 1)}
                            >
                                <Text style={stylesApi.pageButtonText}>Anterior</Text>
                            </TouchableOpacity>

                            <Text style={stylesApi.pageInfo}>
                                Página {currentPage} de {totalPages}
                            </Text>

                            <TouchableOpacity
                                style={[stylesApi.pageButton, currentPage === totalPages && stylesApi.disabledButton]}
                                disabled={currentPage === totalPages}
                                onPress={() => setCurrentPage((prev) => prev + 1)}
                            >
                                <Text style={stylesApi.pageButtonText}>Siguiente</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {/* Modal de detalles */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={stylesApi.modalOverlay}>
                    <View style={stylesApi.modalContent}>
                        <Text style={stylesApi.modalTitle}>{selectedGame?.name}</Text>
                        <Text style={stylesApi.modalText}>📆 {selectedGame?.released_date}</Text>
                        <Text style={stylesApi.modalText}>🧑‍💻 Desarrollador: {selectedGame?.developer}</Text>
                        <Text style={stylesApi.modalText}>🏢 Compañía: {selectedGame?.publisher}</Text>
                        <Text style={stylesApi.modalText}>📝 Descripción:</Text>
                        <Text style={stylesApi.modalDescription}>{selectedGame?.description}</Text>

                        <TouchableOpacity onPress={closeModal} style={stylesApi.closeButton}>
                            <Text style={stylesApi.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

