import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../services/api';
import { OperationItem } from '../types';

interface TimeSelectionScreenProps {
  navigation: any;
  route: {
    params: {
      departure: string;
      arrival: string;
      date: string;
      routeId: string;
    };
  };
}

const TimeSelectionScreen: React.FC<TimeSelectionScreenProps> = ({ navigation, route }) => {
  const { departure, arrival, date, routeId } = route.params;
  const [selectedOperation, setSelectedOperation] = useState<OperationItem | null>(null);
  const [operations, setOperations] = useState<OperationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const operationMap = await apiService.getOperationsByRoute(parseInt(routeId));
      const dateOperations = operationMap[date] || [];
      setOperations(dateOperations);
    } catch (error) {
      console.error('Error loading operations:', error);
      Alert.alert('오류', '운행 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedOperation) {
      Alert.alert('알림', '운행 시간을 선택해주세요.');
      return;
    }
    
    navigation.navigate('Login', {
      departure,
      arrival,
      date,
      routeId,
      operation: selectedOperation,
    });
  };

  const selectOperation = (operation: OperationItem) => {
    setSelectedOperation(operation);
  };

  const formatTime = (timeString: string) => {
    // "22:00:00" -> "22:00"
    return timeString.substring(0, 5);
  };

  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>운행 시간 선택</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.routeInfo}>
        <Text style={styles.routeText}>
          {departure} → {arrival}
        </Text>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>운행 정보를 불러오는 중...</Text>
          </View>
        ) : operations.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>해당 날짜에 운행 정보가 없습니다.</Text>
            <Text style={styles.noDataSubText}>다른 날짜를 선택해보세요.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>운행 시간을 선택하세요</Text>
            
            <View style={styles.operationList}>
              {operations.map((operation, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.operationCard,
                    selectedOperation === operation && styles.selectedOperationCard,
                  ]}
                  onPress={() => selectOperation(operation)}
                >
                  <View style={styles.operationHeader}>
                    <Text style={[
                      styles.departureTime,
                      selectedOperation === operation && styles.selectedText
                    ]}>
                      {formatTime(operation.departureTime)}
                    </Text>
                    <Text style={[
                      styles.price,
                      selectedOperation === operation && styles.selectedText
                    ]}>
                      {formatPrice(operation.price)}
                    </Text>
                  </View>
                  
                  <View style={styles.operationDetails}>
                    <View style={styles.detailRow}>
                      <Text style={[
                        styles.detailLabel,
                        selectedOperation === operation && styles.selectedText
                      ]}>
                        버스회사:
                      </Text>
                      <Text style={[
                        styles.detailValue,
                        selectedOperation === operation && styles.selectedText
                      ]}>
                        {operation.busCompany}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={[
                        styles.detailLabel,
                        selectedOperation === operation && styles.selectedText
                      ]}>
                        버스타입:
                      </Text>
                      <Text style={[
                        styles.detailValue,
                        selectedOperation === operation && styles.selectedText
                      ]}>
                        {operation.busType}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={[
                        styles.detailLabel,
                        selectedOperation === operation && styles.selectedText
                      ]}>
                        소요시간:
                      </Text>
                      <Text style={[
                        styles.detailValue,
                        selectedOperation === operation && styles.selectedText
                      ]}>
                        {operation.duration}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {selectedOperation && (
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedInfoText}>
                  선택된 시간: {formatTime(selectedOperation.departureTime)}
                </Text>
                <Text style={styles.selectedInfoText}>
                  가격: {formatPrice(selectedOperation.price)}
                </Text>
                <Text style={styles.selectedInfoText}>
                  버스: {selectedOperation.busCompany} {selectedOperation.busType}
                </Text>
                <Text style={styles.selectedInfoText}>
                  소요시간: {selectedOperation.duration}
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !selectedOperation && styles.disabledButton,
                ]}
                onPress={handleNext}
                disabled={!selectedOperation}
              >
                <Text style={styles.nextButtonText}>다음</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  routeInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  operationList: {
    marginBottom: 20,
  },
  operationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOperationCard: {
    backgroundColor: 'white',
    borderColor: '#667eea',
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  departureTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedText: {
    color: '#667eea',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  operationDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  selectedInfoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginTop: 15,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDataSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default TimeSelectionScreen;
