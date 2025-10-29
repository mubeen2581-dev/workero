import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const quickActions = [
    {
      title: 'View Jobs',
      icon: 'briefcase-outline',
      color: '#3B82F6',
      onPress: () => navigation.navigate('Jobs' as never),
    },
    {
      title: 'Clock In/Out',
      icon: 'time-outline',
      color: '#10B981',
      onPress: () => navigation.navigate('ClockIn' as never),
    },
    {
      title: 'Inventory',
      icon: 'cube-outline',
      color: '#F59E0B',
      onPress: () => navigation.navigate('Inventory' as never),
    },
    {
      title: 'Profile',
      icon: 'person-outline',
      color: '#8B5CF6',
      onPress: () => navigation.navigate('Profile' as never),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, John!</Text>
        <Text style={styles.subtitle}>Ready to start your day?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Jobs Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
            >
              <Ionicons name={action.icon as any} size={24} color={action.color} />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.activityText}>Completed job #1234 - HVAC Repair</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="location" size={20} color="#3B82F6" />
          <Text style={styles.activityText}>Arrived at job site #1235</Text>
          <Text style={styles.activityTime}>30 minutes ago</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  quickActionsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivity: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default HomeScreen;
