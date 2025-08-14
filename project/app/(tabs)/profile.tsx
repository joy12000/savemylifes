import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, CircleHelp as HelpCircle, LogOut, Copy, Calendar, Award } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  const userCode = 'ABC123';
  const totalCheckIns = 127;
  const streak = 15;

  const copyUserCode = () => {
    Alert.alert(
      '코드 복사됨',
      '친구 코드가 클립보드에 복사되었습니다.',
      [{ text: '확인' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <User size={40} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>김철수</Text>
            <TouchableOpacity style={styles.codeContainer} onPress={copyUserCode}>
              <Text style={styles.userCode}>코드: {userCode}</Text>
              <Copy size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Calendar size={24} color="#10B981" />
            <Text style={styles.statNumber}>{totalCheckIns}</Text>
            <Text style={styles.statLabel}>총 신고 횟수</Text>
          </View>
          <View style={styles.statItem}>
            <Award size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>연속 신고</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.settingText}>푸시 알림</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
              thumbColor={notificationsEnabled ? '#10B981' : '#9CA3AF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.settingText}>긴급 모드</Text>
            </View>
            <Switch
              value={emergencyMode}
              onValueChange={setEmergencyMode}
              trackColor={{ false: '#E5E7EB', true: '#FECACA' }}
              thumbColor={emergencyMode ? '#EF4444' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionItem}>
            <HelpCircle size={20} color="#6B7280" />
            <Text style={styles.actionText}>도움말</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.actionText, styles.logoutText]}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Info */}
        {emergencyMode && (
          <View style={styles.emergencyInfo}>
            <Shield size={20} color="#EF4444" />
            <Text style={styles.emergencyTitle}>긴급 모드 활성화</Text>
            <Text style={styles.emergencyDescription}>
              생존신고가 24시간 이상 없을 경우 등록된 긴급 연락처로 알림이 전송됩니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 24,
    marginTop: 8,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCode: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  logoutText: {
    color: '#EF4444',
  },
  emergencyInfo: {
    backgroundColor: '#FEF2F2',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 8,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 20,
  },
});