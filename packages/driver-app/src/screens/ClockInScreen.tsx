import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const ClockInScreen = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [workDuration, setWorkDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isClockedIn) {
        setWorkDuration(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for clock in/out');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleClockIn = () => {
    Alert.alert(
      'Clock In',
      'Are you sure you want to clock in?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clock In', 
          onPress: () => {
            setIsClockedIn(true);
            setWorkDuration(0);
            console.log('Clocked in at:', new Date());
          }
        },
      ]
    );
  };

  const handleClockOut = () => {
    Alert.alert(
      'Clock Out',
      `Are you sure you want to clock out?\n\nWork duration: ${formatDuration(workDuration)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clock Out', 
          onPress: () => {
            setIsClockedIn(false);
            console.log('Clocked out at:', new Date());
            console.log('Total work duration:', formatDuration(workDuration));
          }
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Time Tracking</Text>
        <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusIndicator}>
          <Ionicons 
            name={isClockedIn ? "checkmark-circle" : "time-outline"} 
            size={48} 
            color={isClockedIn ? "#10B981" : "#6B7280"} 
          />
        </View>
        
        <Text style={styles.statusText}>
          {isClockedIn ? 'Currently Working' : 'Not Clocked In'}
        </Text>
        
        {isClockedIn && (
          <Text style={styles.durationText}>
            Work Duration: {formatDuration(workDuration)}
          </Text>
        )}
      </View>

      <View style={styles.locationCard}>
        <Text style={styles.cardTitle}>Location</Text>
        {location ? (
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={16} color="#3B82F6" />
            <Text style={styles.locationText}>
              Lat: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lng: {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
        ) : (
          <Text style={styles.noLocationText}>Location not available</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        {!isClockedIn ? (
          <TouchableOpacity 
            style={[styles.actionButton, styles.clockInButton]}
            onPress={handleClockIn}
          >
            <Ionicons name="play" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Clock In</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.clockOutButton]}
            onPress={handleClockOut}
          >
            <Ionicons name="stop" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Clock Out</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={getCurrentLocation}
        >
          <Ionicons name="refresh" size={20} color="#3B82F6" />
          <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Refresh Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.todaySummary}>
        <Text style={styles.summaryTitle}>Today's Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Hours:</Text>
          <Text style={styles.summaryValue}>8h 30m</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Jobs Completed:</Text>
          <Text style={styles.summaryValue}>3</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Miles Traveled:</Text>
          <Text style={styles.summaryValue}>45.2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  currentTime: {
    fontSize: 18,
    color: '#6B7280',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  noLocationText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  clockInButton: {
    backgroundColor: '#10B981',
  },
  clockOutButton: {
    backgroundColor: '#EF4444',
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
  todaySummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});

export default ClockInScreen;
