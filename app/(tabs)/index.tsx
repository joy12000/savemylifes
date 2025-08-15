import React, { useState, useEffect } from 'react';
import { useApi } from '@/lib/api';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from '@/components/icons';
import { FriendStatusCard } from '@/components/FriendStatusCard';
import { CheckInButton } from '@/components/CheckInButton';
import { mockData } from '@/data/mockData';

export default function HomeScreen() {
  const { authedFetch } = useApi();
  const [sending, setSending] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [friends, setFriends] = useState(mockData.friends);
  const [refreshing, setRefreshing] = useState(false);

  const checkCanCheckIn = () => {
    if (lastCheckIn) {
      const today = new Date();
      const lastCheckInDate = new Date(lastCheckIn);
      const isSameDay = 
        today.getDate() === lastCheckInDate.getDate() &&
        today.getMonth() === lastCheckInDate.getMonth() &&
        today.getFullYear() === lastCheckInDate.getFullYear();
      
      setCanCheckIn(!isSameDay);
    }
  };

  useEffect(() => {
    checkCanCheckIn();
  }, [lastCheckIn]);

  const handleCheckIn = () => {
    if (!canCheckIn) {
      Alert.alert('알림', '오늘은 이미 생존신고를 완료했습니다.');
      return;
    }

    const now = new Date();
    setLastCheckIn(now);
    setCanCheckIn(false);
    
    Alert.alert(
      '생존신고 완료!',
      '친구들에게 안전 상태가 전달되었습니다.',
      [{ text: '확인', style: 'default' }]
    );
  };

  async function sendCheckIn(){
    if(sending) return;
    setSending(true);
    try{
      let location: {lat:number, lon:number} | undefined = undefined;
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator){
        await new Promise<void>((resolve)=>{
          navigator.geolocation.getCurrentPosition((pos)=>{
            location = { lat: pos.coords.latitude, lon: pos.coords.longitude }; resolve();
          }, ()=>resolve(), { enableHighAccuracy: true, timeout: 4000 })
        })
      }
      await authedFetch('/.netlify/functions/report-submit', {
        method: 'POST',
        body: JSON.stringify({ message: '살아있습니다.', location })
      });
      Alert.alert('전송 완료', '생존신고가 저장되었습니다.');
    }catch(e:any){
      Alert.alert('전송 실패', String(e?.message ?? e));
    }finally{
      setSending(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusStats = () => {
    const safe = friends.filter(f => f.status === 'safe').length;
    const overdue = friends.filter(f => f.status === 'overdue').length;
    const missing = friends.filter(f => f.status === 'missing').length;
    return { safe, overdue, missing };
  };

  const stats = getStatusStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>드럼통 방지기</Text>
          <Text style={styles.subtitle}>안전한 하루를 위한 생존신고</Text>
        </View>

        {/* Check-in Section */}
        <View style={styles.checkInSection}>
          <CheckInButton onPress={sendCheckIn} 
            onPress={handleCheckIn}
            canCheckIn={canCheckIn}
            lastCheckIn={lastCheckIn}
          />
          
          {lastCheckIn && (
            <View style={styles.lastCheckInContainer}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.lastCheckInText}>
                마지막 신고: {lastCheckIn.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Status Overview */}
        <View style={styles.statusOverview}>
          <Text style={styles.sectionTitle}>친구 상태 현황</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.safeCard]}>
              <CheckCircle size={24} color="#10B981" />
              <Text style={styles.statNumber}>{stats.safe}</Text>
              <Text style={styles.statLabel}>안전</Text>
            </View>
            <View style={[styles.statCard, styles.overdueCard]}>
              <Clock size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{stats.overdue}</Text>
              <Text style={styles.statLabel}>지연</Text>
            </View>
            <View style={[styles.statCard, styles.missingCard]}>
              <AlertTriangle size={24} color="#EF4444" />
              <Text style={styles.statNumber}>{stats.missing}</Text>
              <Text style={styles.statLabel}>미신고</Text>
            </View>
          </View>
        </View>

        {/* Friends List */}
        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>친구 목록</Text>
          {friends.map((friend) => (
            <FriendStatusCard 
              key={friend.id} 
              friend={friend}
              onRemind={() => {
                Alert.alert(
                  '알림 발송',
                  `${friend.name}님에게 생존신고 알림을 보냈습니다.`
                );
              }}
            />
          ))}
        </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  checkInSection: {
    padding: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  lastCheckInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  lastCheckInText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusOverview: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  safeCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  overdueCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  missingCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
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
    fontWeight: '500',
    marginTop: 4,
  },
  friendsSection: {
    padding: 24,
    paddingTop: 8,
  },
});