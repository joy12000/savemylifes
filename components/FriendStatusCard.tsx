import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Bell, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface Friend {
  id: string;
  name: string;
  status: 'safe' | 'overdue' | 'missing';
  lastCheckIn: Date;
  checkInCount: number;
}

interface FriendStatusCardProps {
  friend: Friend;
  onRemind: () => void;
}

export function FriendStatusCard({ friend, onRemind }: FriendStatusCardProps) {
  const getStatusIcon = () => {
    switch (friend.status) {
      case 'safe':
        return <CheckCircle size={20} color="#10B981" />;
      case 'overdue':
        return <Clock size={20} color="#F59E0B" />;
      case 'missing':
        return <AlertTriangle size={20} color="#EF4444" />;
    }
  };

  const getStatusText = () => {
    switch (friend.status) {
      case 'safe':
        return '안전';
      case 'overdue':
        return '지연';
      case 'missing':
        return '미신고';
    }
  };

  const getStatusColor = () => {
    switch (friend.status) {
      case 'safe':
        return '#10B981';
      case 'overdue':
        return '#F59E0B';
      case 'missing':
        return '#EF4444';
    }
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diff = now.getTime() - friend.lastCheckIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '방금 전';
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.friendInfo}>
          <View style={styles.friendAvatar}>
            <Text style={styles.avatarText}>
              {friend.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.friendDetails}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <View style={styles.statusContainer}>
              {getStatusIcon()}
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
          </View>
        </View>
        
        {friend.status !== 'safe' && (
          <TouchableOpacity style={styles.remindButton} onPress={onRemind}>
            <Bell size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.lastCheckInText}>
          마지막 신고: {getTimeAgo()}
        </Text>
        <Text style={styles.checkInCountText}>
          총 {friend.checkInCount}회 신고
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  friendDetails: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  remindButton: {
    backgroundColor: '#F59E0B',
    padding: 8,
    borderRadius: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastCheckInText: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkInCountText: {
    fontSize: 12,
    color: '#6B7280',
  },
});