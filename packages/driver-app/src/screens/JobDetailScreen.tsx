import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

interface Job {
  id: string;
  title: string;
  client: string;
  address: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  scheduledTime: string;
  estimatedDuration: string;
  description: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

const JobDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { job } = route.params as { job: Job };
  
  const [currentStatus, setCurrentStatus] = useState(job.status);

  const handleStatusChange = (newStatus: string) => {
    Alert.alert(
      'Change Status',
      `Are you sure you want to change status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            setCurrentStatus(newStatus as any);
            console.log('Status changed to:', newStatus);
          }
        },
      ]
    );
  };

  const handleCallClient = () => {
    Alert.alert(
      'Call Client',
      `Call ${job.contactInfo.name} at ${job.contactInfo.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling client...') },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
      case 'completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
          <Text style={styles.statusText}>{currentStatus.replace('_', ' ').toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.clientName}>{job.client}</Text>
          <Text style={styles.address}>{job.address}</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text style={styles.contactText}>{job.contactInfo.name}</Text>
            </View>
            <TouchableOpacity style={styles.contactItem} onPress={handleCallClient}>
              <Ionicons name="call-outline" size={16} color="#3B82F6" />
              <Text style={[styles.contactText, { color: '#3B82F6' }]}>{job.contactInfo.phone}</Text>
            </TouchableOpacity>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color="#6B7280" />
              <Text style={styles.contactText}>{job.contactInfo.email}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.detailLabel}>Scheduled Time:</Text>
            <Text style={styles.detailValue}>{job.scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="hourglass-outline" size={16} color="#6B7280" />
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{job.estimatedDuration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={16} color="#6B7280" />
            <Text style={styles.detailLabel}>Priority:</Text>
            <Text style={styles.detailValue}>{job.priority.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.infoCard}>
          <Text style={styles.description}>{job.description || 'No description provided.'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          {currentStatus === 'pending' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.startButton]}
              onPress={() => handleStatusChange('in_progress')}
            >
              <Ionicons name="play-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Start Job</Text>
            </TouchableOpacity>
          )}
          
          {currentStatus === 'in_progress' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusChange('completed')}
            >
              <Ionicons name="checkmark-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Complete Job</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Ionicons name="camera-outline" size={20} color="#3B82F6" />
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Ionicons name="document-outline" size={20} color="#3B82F6" />
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Add Note</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  contactInfo: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  completeButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default JobDetailScreen;