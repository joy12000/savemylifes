export const mockData = {
  friends: [
    {
      id: '1',
      name: '김영희',
      status: 'safe' as const,
      lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      checkInCount: 45,
    },
    {
      id: '2',
      name: '박민수',
      status: 'overdue' as const,
      lastCheckIn: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
      checkInCount: 32,
    },
    {
      id: '3',
      name: '이지은',
      status: 'safe' as const,
      lastCheckIn: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      checkInCount: 67,
    },
    {
      id: '4',
      name: '최동호',
      status: 'missing' as const,
      lastCheckIn: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
      checkInCount: 12,
    },
  ],
  chatRooms: [
    {
      id: '1',
      friend: { name: '김영희' },
      lastMessage: '오늘도 안전하게 하루 보내세요!',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 2,
      unlocked: true,
      checkInCount: 45,
      requiredCheckIns: 10,
    },
    {
      id: '2',
      friend: { name: '이지은' },
      lastMessage: '감사합니다. 오늘도 화이팅!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0,
      unlocked: true,
      checkInCount: 67,
      requiredCheckIns: 10,
    },
    {
      id: '3',
      friend: { name: '박민수' },
      unreadCount: 0,
      unlocked: false,
      checkInCount: 7,
      requiredCheckIns: 10,
    },
    {
      id: '4',
      friend: { name: '최동호' },
      unreadCount: 0,
      unlocked: false,
      checkInCount: 3,
      requiredCheckIns: 10,
    },
  ],
};