import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { stylesCrud } from '../styles/crudStyles';

interface Employee {
    id: string;
    name: string;
    role: string;
    email: string;
}

export default function Crud() {
    const [employees, setEmployees] = useState<Employee[]>([
        { id: '1', name: 'Juan Pérez', role: 'Desarrollador', email: 'juan@example.com' },
        { id: '2', name: 'María Gómez', role: 'Diseñadora', email: 'maria@example.com' },
        { id: '3', name: 'Carlos Ruiz', role: 'QA Tester', email: 'carlos@example.com' },
        { id: '4', name: 'Laura Martínez', role: 'Project Manager', email: 'laura@example.com' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [newEmployee, setNewEmployee] = useState({ name: '', role: '', email: '' });

    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(true);

    const handleEdit = (employee: Employee) => {
        setIsEditing(true);
        setCurrentId(employee.id);
        setNewEmployee({
            name: employee.name,
            role: employee.role,
            email: employee.email,
        });
        setModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Alert.alert('Eliminar', '¿Estás seguro de eliminar este empleado?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => setEmployees((prev) => prev.filter((emp) => emp.id !== id)),
            },
        ]);
    };

    const handleAdd = () => {
        setIsEditing(false);
        setCurrentId(null);
        setNewEmployee({ name: '', role: '', email: '' });
        setModalVisible(true);
    };

    const handleSave = () => {
        const { name, role, email } = newEmployee;
        if (!name || !role || !email) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        if (isEditing && currentId) {
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === currentId ? { ...emp, name, role, email } : emp
                )
            );
        } else {
            const newEntry: Employee = {
                id: (employees.length + 1).toString(),
                name,
                role,
                email,
            };
            setEmployees((prev) => [...prev, newEntry]);
        }

        setModalVisible(false);
    };

    const filteredEmployees = employees
        .filter((emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            sortAsc
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        );

    return (
        <View style={stylesCrud.container}>


            {/* Tabla */}
            <View style={stylesCrud.card}>
                <Text style={stylesCrud.title}>Lista de Empleados</Text>

                {/* Buscador y Ordenar */}
                <View style={stylesCrud.searchSortContainer}>
                    <TextInput
                        style={stylesCrud.searchInput}
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <TouchableOpacity onPress={() => setSortAsc((prev) => !prev)} style={stylesCrud.sortButton}>
                        <MaterialIcons name={sortAsc ? 'arrow-downward' : 'arrow-upward'} size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
                <View style={stylesCrud.tableHeader}>
                    <Text style={[stylesCrud.cell, stylesCrud.headerCell]}>Nombre</Text>
                    <Text style={[stylesCrud.cell, stylesCrud.headerCell]}>Rol</Text>
                    <Text style={[stylesCrud.cell, stylesCrud.headerCell]}>Acciones</Text>
                </View>

                <FlatList
                    data={filteredEmployees}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={stylesCrud.tableRow}>
                            <Text style={stylesCrud.cell}>{item.name}</Text>
                            <Text style={stylesCrud.cell}>{item.role}</Text>
                            <View style={[stylesCrud.cell, stylesCrud.actions]}>
                                <TouchableOpacity onPress={() => handleEdit(item)} style={stylesCrud.iconButton}>
                                    <MaterialIcons name="edit" size={20} color="#007AFF" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} style={stylesCrud.iconButton}>
                                    <MaterialIcons name="delete" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Botón flotante */}
            <TouchableOpacity style={stylesCrud.fab} onPress={handleAdd}>
                <MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={stylesCrud.modalOverlay}>
                    <View style={stylesCrud.modalContent}>
                        <Text style={stylesCrud.modalTitle}>
                            {isEditing ? 'Editar Empleado' : 'Agregar Empleado'}
                        </Text>

                        <TextInput
                            placeholder="Nombre"
                            style={stylesCrud.input}
                            value={newEmployee.name}
                            onChangeText={(text) => setNewEmployee({ ...newEmployee, name: text })}
                        />
                        <TextInput
                            placeholder="Rol"
                            style={stylesCrud.input}
                            value={newEmployee.role}
                            onChangeText={(text) => setNewEmployee({ ...newEmployee, role: text })}
                        />
                        <TextInput
                            placeholder="Email"
                            style={stylesCrud.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmployee.email}
                            onChangeText={(text) => setNewEmployee({ ...newEmployee, email: text })}
                        />

                        <View style={stylesCrud.modalButtons}>
                            <TouchableOpacity
                                style={stylesCrud.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={stylesCrud.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesCrud.saveButton} onPress={handleSave}>
                                <Text style={stylesCrud.saveText}>
                                    {isEditing ? 'Actualizar' : 'Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
