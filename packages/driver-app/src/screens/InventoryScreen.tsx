import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  lastUpdated: string;
}

const InventoryScreen = () => {
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'HVAC Filter 16x20',
      category: 'HVAC',
      quantity: 12,
      unit: 'pieces',
      location: 'Van A',
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      name: 'Pipe Wrench 12"',
      category: 'Tools',
      quantity: 2,
      unit: 'pieces',
      location: 'Toolbox',
      lastUpdated: '1 day ago',
    },
    {
      id: '3',
      name: 'Electrical Wire 12 AWG',
      category: 'Electrical',
      quantity: 50,
      unit: 'feet',
      location: 'Van A',
      lastUpdated: '3 hours ago',
    },
    {
      id: '4',
      name: 'PVC Pipe 1/2"',
      category: 'Plumbing',
      quantity: 8,
      unit: 'feet',
      location: 'Van A',
      lastUpdated: '1 hour ago',
    },
    {
      id: '5',
      name: 'Screwdriver Set',
      category: 'Tools',
      quantity: 1,
      unit: 'set',
      location: 'Toolbox',
      lastUpdated: '2 days ago',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'HVAC', 'Tools', 'Electrical', 'Plumbing'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'HVAC': return '#3B82F6';
      case 'Tools': return '#F59E0B';
      case 'Electrical': return '#EF4444';
      case 'Plumbing': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity === 0) return '#EF4444';
    if (quantity <= 5) return '#F59E0B';
    return '#10B981';
  };

  const handleItemPress = (item: InventoryItem) => {
    Alert.alert(
      item.name,
      `Category: ${item.category}\nQuantity: ${item.quantity} ${item.unit}\nLocation: ${item.location}\nLast Updated: ${item.lastUpdated}`,
      [
        { text: 'OK' },
        { text: 'Update Quantity', onPress: () => console.log('Update quantity for:', item.id) },
      ]
    );
  };

  const handleAddItem = () => {
    Alert.alert(
      'Add Item',
      'Add new inventory item',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => console.log('Adding new item...') },
      ]
    );
  };

  const filteredInventory = selectedCategory === 'All' 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.quantity} {item.unit}
          </Text>
          <View style={[styles.quantityIndicator, { backgroundColor: getQuantityColor(item.quantity) }]} />
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.lastUpdated}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Van Inventory</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={filteredInventory}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  selectedCategoryButton: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  itemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  quantityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});

export default InventoryScreen;
