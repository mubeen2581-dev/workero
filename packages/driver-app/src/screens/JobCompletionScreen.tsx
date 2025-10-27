import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateJobStatus } from '../store/driverSlice';
import { driverApiService } from '../services/apiService';
import { Material } from '../types';

const JobCompletionScreen = ({ route, navigation }: any) => {
  const { jobId } = route.params;
  const dispatch = useDispatch();
  const { jobs, location } = useSelector((state: RootState) => state.driver);
  const job = jobs.find(j => j.id === jobId);

  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [materialsUsed, setMaterialsUsed] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  const addPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const completeJob = async () => {
    if (!job || !location) return;

    if (photos.length === 0) {
      Alert.alert('Photos Required', 'Please add at least one photo before completing the job.');
      return;
    }

    setLoading(true);
    try {
      // Upload photos
      const uploadedPhotos = await Promise.all(
        photos.map(photo => driverApiService.uploadPhoto(jobId, photo))
      );

      // Clock out
      await driverApiService.clockOut(jobId, {
        lat: location.latitude,
        lng: location.longitude,
      });

      // Update job status
      await driverApiService.updateJobStatus({
        jobId,
        status: 'completed',
        notes,
        photos: uploadedPhotos,
        materialsUsed,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp,
        },
      });

      dispatch(updateJobStatus({ jobId, status: 'completed' }));

      Alert.alert(
        'Job Completed',
        'Job has been marked as complete. Invoice will be generated automatically.',
        [{ text: 'OK', onPress: () => navigation.navigate('JobList') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Job</Text>
        <Text style={styles.jobTitle}>{job.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Photos</Text>
        <Text style={styles.sectionSubtitle}>Add before and after photos</Text>
        
        <ScrollView horizontal style={styles.photosContainer}>
          {photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.photo} />
          ))}
          <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
            <Text style={styles.addPhotoText}>+ Add Photo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materials Used</Text>
        <TouchableOpacity
          style={styles.addMaterialButton}
          onPress={() => navigation.navigate('MaterialSelection', { jobId })}
        >
          <Text style={styles.addMaterialText}>+ Add Materials</Text>
        </TouchableOpacity>
        
        {materialsUsed.map((material, index) => (
          <View key={index} style={styles.materialItem}>
            <Text style={styles.materialName}>{material.name}</Text>
            <Text style={styles.materialQuantity}>Qty: {material.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any additional notes about the job..."
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Signature</Text>
        <TouchableOpacity
          style={styles.signatureButton}
          onPress={() => navigation.navigate('Signature', { jobId })}
        >
          <Text style={styles.signatureButtonText}>Capture Signature</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.completeButton, loading && styles.disabledButton]}
          onPress={completeJob}
          disabled={loading}
        >
          <Text style={styles.completeButtonText}>
            {loading ? 'Completing Job...' : 'Complete Job'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  jobTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  photosContainer: {
    flexDirection: 'row',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  addMaterialButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addMaterialText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  materialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  materialName: {
    fontSize: 14,
    color: '#374151',
  },
  materialQuantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  signatureButton: {
    padding: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  signatureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionSection: {
    padding: 16,
  },
  completeButton: {
    paddingVertical: 16,
    backgroundColor: '#059669',
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default JobCompletionScreen;