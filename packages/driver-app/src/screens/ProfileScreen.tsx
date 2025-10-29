import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => console.log('Logging out...') },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings coming soon!');
  };

  const handleHelp = () => {
    Alert.alert('Help', 'Help and support coming soon!');
  };

  const profileStats = [
    { label: 'Jobs Completed', value: '127', icon: 'checkmark-circle-outline' },
    { label: 'Hours Worked', value: '1,240', icon: 'time-outline' },
    { label: 'Rating', value: '4.8', icon: 'star-outline' },
    { label: 'Miles Traveled', value: '2,450', icon: 'car-outline' },
  ];

  const menuItems = [
    { title: 'Edit Profile', icon: 'person-outline', onPress: handleEditProfile },
    { title: 'Change Password', icon: 'lock-closed-outline', onPress: handleChangePassword },
    { title: 'Notifications', icon: 'notifications-outline', onPress: handleNotifications },
    { title: 'Help & Support', icon: 'help-circle-outline', onPress: handleHelp },
    { title: 'About', icon: 'information-circle-outline', onPress: () => Alert.alert('About', 'Workero Driver App v1.0.0') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>John Smith</Text>
        <Text style={styles.role}>HVAC Technician</Text>
        <Text style={styles.employeeId}>Employee ID: #12345</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Workero Driver App</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  employeeId: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  logoutContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
  },
  appVersion: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});

export default ProfileScreen;
