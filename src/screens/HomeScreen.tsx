import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService, AlertResponse } from '../services/api';

interface HomeScreenProps {
  navigation: any;
}

interface AlertItem {
  id: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  targetSeats: number;
  isActive: boolean;
  routeId: string;
  scheduleId: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserAlerts();
  }, []);

  const loadUserAlerts = async () => {
    try {
      setLoading(true);
      const userAlerts = await apiService.getUserAlerts('user123'); // 실제로는 로그인된 사용자 ID 사용
      
      // API 응답을 화면에 맞는 형태로 변환
      const formattedAlerts: AlertItem[] = userAlerts.map(alert => ({
        id: alert.id,
        departure: '서울', // 실제로는 routeId로 노선 정보를 가져와야 함
        arrival: '부산',
        date: '2024-01-15',
        time: '14:00',
        targetSeats: alert.targetSeats,
        isActive: alert.isActive,
        routeId: alert.routeId,
        scheduleId: alert.scheduleId,
      }));
      
      setAlerts(formattedAlerts);
    } catch (error) {
      console.error('Error loading user alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserAlerts();
    setRefreshing(false);
  };

  const toggleAlert = async (id: string) => {
    try {
      const alert = alerts.find(a => a.id === id);
      if (!alert) return;

      await apiService.updateAlertStatus(id, !alert.isActive);
      
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
        )
      );
    } catch (error) {
      console.error('Error toggling alert:', error);
      Alert.alert('오류', '알림 상태 변경에 실패했습니다.');
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await apiService.deleteAlert(id);
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Error deleting alert:', error);
      Alert.alert('오류', '알림 삭제에 실패했습니다.');
    }
  };

  const renderAlertItem = ({ item }: { item: AlertItem }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>
            {item.departure} → {item.arrival}
          </Text>
          <Text style={styles.dateTimeText}>
            {item.date} {item.time}
          </Text>
        </View>
        <View style={styles.alertStatus}>
          <View style={[
            styles.statusDot,
            item.isActive ? styles.activeDot : styles.inactiveDot
          ]} />
          <Text style={[
            styles.statusText,
            item.isActive ? styles.activeText : styles.inactiveText
          ]}>
            {item.isActive ? '활성' : '비활성'}
          </Text>
        </View>
      </View>
      
      <View style={styles.alertDetails}>
        <Text style={styles.seatInfo}>
          {item.targetSeats}석 이상 빈자리 알림
        </Text>
      </View>
      
      <View style={styles.alertActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            item.isActive ? styles.deactivateButton : styles.activateButton
          ]}
          onPress={() => toggleAlert(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.isActive ? '일시정지' : '활성화'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteAlert(item.id)}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>버스표 알리미</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 환영 메시지 */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>안녕하세요! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            현재 {alerts.filter(alert => alert.isActive).length}개의 알림이 활성화되어 있습니다.
          </Text>
        </View>

        {/* 새로운 알림 설정 버튼 */}
        <TouchableOpacity
          style={styles.newAlertButton}
          onPress={() => navigation.navigate('RouteSelection')}
        >
          <Text style={styles.newAlertIcon}>➕</Text>
          <Text style={styles.newAlertText}>새로운 알림 설정</Text>
        </TouchableOpacity>

        {/* 알림 목록 */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>내 알림 목록</Text>
          {alerts.length > 0 ? (
            <FlatList
              data={alerts}
              renderItem={renderAlertItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>알림이 없습니다</Text>
              <Text style={styles.emptyText}>
                새로운 알림을 설정해보세요!
              </Text>
            </View>
          )}
        </View>

        {/* 통계 정보 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>통계</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{alerts.length}</Text>
              <Text style={styles.statLabel}>전체 알림</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {alerts.filter(alert => alert.isActive).length}
              </Text>
              <Text style={styles.statLabel}>활성 알림</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>성공 알림</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  newAlertButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newAlertIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  newAlertText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  alertsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  alertStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
  inactiveDot: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#4CAF50',
  },
  inactiveText: {
    color: '#FF9800',
  },
  alertDetails: {
    marginBottom: 15,
  },
  seatInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activateButton: {
    backgroundColor: '#4CAF50',
  },
  deactivateButton: {
    backgroundColor: '#FF9800',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default HomeScreen;
