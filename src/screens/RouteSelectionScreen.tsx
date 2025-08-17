import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { apiService } from '../services/api';
import { Terminal, AREA_CODES, groupTerminalsByArea, getDateOptions } from '../types';

interface RouteSelectionScreenProps {
  navigation: any;
}

const RouteSelectionScreen: React.FC<RouteSelectionScreenProps> = ({ navigation }) => {
  const [departureTerminal, setDepartureTerminal] = useState<Terminal | null>(null);
  const [arrivalTerminal, setArrivalTerminal] = useState<Terminal | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [departureTerminals, setDepartureTerminals] = useState<Terminal[]>([]);
  const [arrivalTerminals, setArrivalTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingArrival, setLoadingArrival] = useState(false);
  
  // 드롭다운 상태
  const [showDepartureAreaModal, setShowDepartureAreaModal] = useState(false);
  const [showDepartureTerminalModal, setShowDepartureTerminalModal] = useState(false);
  const [showArrivalAreaModal, setShowArrivalAreaModal] = useState(false);
  const [showArrivalTerminalModal, setShowArrivalTerminalModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  
  // 선택된 지역
  const [selectedDepartureArea, setSelectedDepartureArea] = useState<string>('');
  const [selectedArrivalArea, setSelectedArrivalArea] = useState<string>('');

  // 날짜 옵션
  const dateOptions = getDateOptions();

  useEffect(() => {
    loadDepartureTerminals();
  }, []);

  const loadDepartureTerminals = async () => {
    try {
      setLoading(true);
      const terminals = await apiService.getDepartureTerminals();
      setDepartureTerminals(terminals);
    } catch (error) {
      console.error('Error loading departure terminals:', error);
      Alert.alert('오류', '출발 터미널을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadArrivalTerminals = async (departureTerminalId: string) => {
    try {
      setLoadingArrival(true);
      const terminals = await apiService.getArrivalTerminals(departureTerminalId);
      setArrivalTerminals(terminals);
    } catch (error) {
      console.error('Error loading arrival terminals:', error);
      Alert.alert('오류', '도착 터미널을 불러오는데 실패했습니다.');
    } finally {
      setLoadingArrival(false);
    }
  };

  const selectDepartureTerminal = async (terminal: Terminal) => {
    setDepartureTerminal(terminal);
    setArrivalTerminal(null);
    setSelectedArrivalArea('');
    setShowDepartureTerminalModal(false);
    await loadArrivalTerminals(terminal.id);
  };

  const selectArrivalTerminal = (terminal: Terminal) => {
    setArrivalTerminal(terminal);
    setShowArrivalTerminalModal(false);
  };

  const selectDate = (dateValue: string) => {
    setSelectedDate(dateValue);
    setShowDateModal(false);
  };

  const handleNext = () => {
    if (!departureTerminal || !arrivalTerminal) {
      Alert.alert('알림', '출발 터미널과 도착 터미널을 모두 선택해주세요.');
      return;
    }
    if (departureTerminal.id === arrivalTerminal.id) {
      Alert.alert('알림', '출발 터미널과 도착 터미널은 다르게 선택해주세요.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('알림', '날짜를 선택해주세요.');
      return;
    }

    // 안전하게 routeId 처리
    const routeId = departureTerminal?.routeId?.toString() || '1';
    
    navigation.navigate('TimeSelection', {
      departure: departureTerminal.name,
      arrival: arrivalTerminal.name,
      date: selectedDate,
      routeId: routeId,
    });
  };

  const groupedDepartureTerminals = groupTerminalsByArea(departureTerminals);
  const groupedArrivalTerminals = groupTerminalsByArea(arrivalTerminals);

  const renderAreaModal = (
    visible: boolean,
    onClose: () => void,
    areas: string[],
    onSelectArea: (area: string) => void,
    title: string
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {areas.map((area) => (
              <TouchableOpacity
                key={area}
                style={styles.areaItem}
                onPress={() => {
                  onSelectArea(area);
                  onClose();
                }}
              >
                <Text style={styles.areaItemText}>{area}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderTerminalModal = (
    visible: boolean,
    onClose: () => void,
    terminals: Terminal[],
    onSelectTerminal: (terminal: Terminal) => void,
    title: string
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {terminals.map((terminal) => (
              <TouchableOpacity
                key={terminal.id}
                style={styles.terminalItem}
                onPress={() => onSelectTerminal(terminal)}
              >
                <Text style={styles.terminalItemText}>{terminal.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderDateModal = (
    visible: boolean,
    onClose: () => void,
    onSelectDate: (date: string) => void,
    title: string
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {dateOptions.map((dateOption) => (
              <TouchableOpacity
                key={dateOption.value}
                style={[
                  styles.dateItem,
                  dateOption.isToday && styles.todayItem
                ]}
                onPress={() => onSelectDate(dateOption.value)}
              >
                <Text style={[
                  styles.dateItemText,
                  dateOption.isToday && styles.todayItemText
                ]}>
                  {dateOption.label}
                  {dateOption.isToday && ' (오늘)'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

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
        <Text style={styles.headerTitle}>노선 선택</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>터미널을 불러오는 중...</Text>
          </View>
        ) : (
          <>
            {/* 출발 터미널 선택 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>출발 터미널</Text>
              
              {/* 지역 선택 */}
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowDepartureAreaModal(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedDepartureArea || '지역을 선택하세요'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {/* 터미널 선택 */}
              {selectedDepartureArea && (
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowDepartureTerminalModal(true)}
                >
                  <Text style={styles.dropdownButtonText}>
                    {departureTerminal ? departureTerminal.name : '터미널을 선택하세요'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 도착 터미널 선택 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>도착 터미널</Text>
              
              {loadingArrival ? (
                <View style={styles.loadingArrivalContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.loadingArrivalText}>도착 터미널을 불러오는 중...</Text>
                </View>
              ) : (
                <>
                  {/* 지역 선택 */}
                  <TouchableOpacity
                    style={[
                      styles.dropdownButton,
                      !departureTerminal && styles.disabledDropdownButton
                    ]}
                    onPress={() => departureTerminal && setShowArrivalAreaModal(true)}
                    disabled={!departureTerminal}
                  >
                    <Text style={[
                      styles.dropdownButtonText,
                      !departureTerminal && styles.disabledDropdownButtonText
                    ]}>
                      {selectedArrivalArea || '지역을 선택하세요'}
                    </Text>
                    <Text style={[
                      styles.dropdownArrow,
                      !departureTerminal && styles.disabledDropdownButtonText
                    ]}>▼</Text>
                  </TouchableOpacity>

                  {/* 터미널 선택 */}
                  {selectedArrivalArea && (
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowArrivalTerminalModal(true)}
                    >
                      <Text style={styles.dropdownButtonText}>
                        {arrivalTerminal ? arrivalTerminal.name : '터미널을 선택하세요'}
                      </Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            {/* 날짜 선택 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>날짜</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowDateModal(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedDate ? dateOptions.find(d => d.value === selectedDate)?.label : '날짜를 선택하세요'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  (!departureTerminal || !arrivalTerminal || !selectedDate) && styles.disabledButton,
                ]}
                onPress={handleNext}
                disabled={!departureTerminal || !arrivalTerminal || !selectedDate}
              >
                <Text style={styles.nextButtonText}>다음</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* 출발 지역 선택 모달 */}
      {renderAreaModal(
        showDepartureAreaModal,
        () => setShowDepartureAreaModal(false),
        Object.keys(groupedDepartureTerminals),
        (area) => {
          setSelectedDepartureArea(area);
          setShowDepartureTerminalModal(true);
        },
        '출발 지역 선택'
      )}

      {/* 출발 터미널 선택 모달 */}
      {renderTerminalModal(
        showDepartureTerminalModal,
        () => setShowDepartureTerminalModal(false),
        groupedDepartureTerminals[selectedDepartureArea] || [],
        selectDepartureTerminal,
        `${selectedDepartureArea} 터미널 선택`
      )}

      {/* 도착 지역 선택 모달 */}
      {renderAreaModal(
        showArrivalAreaModal,
        () => setShowArrivalAreaModal(false),
        Object.keys(groupedArrivalTerminals),
        (area) => {
          setSelectedArrivalArea(area);
          setShowArrivalTerminalModal(true);
        },
        '도착 지역 선택'
      )}

      {/* 도착 터미널 선택 모달 */}
      {renderTerminalModal(
        showArrivalTerminalModal,
        () => setShowArrivalTerminalModal(false),
        groupedArrivalTerminals[selectedArrivalArea] || [],
        selectArrivalTerminal,
        `${selectedArrivalArea} 터미널 선택`
      )}

      {/* 날짜 선택 모달 */}
      {renderDateModal(
        showDateModal,
        () => setShowDateModal(false),
        selectDate,
        '날짜 선택'
      )}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  dropdownButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledDropdownButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledDropdownButtonText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  dropdownArrow: {
    color: 'white',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 20,
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
  loadingArrivalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingArrivalText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 10,
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '80%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  modalBody: {
    padding: 10,
  },
  areaItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  areaItemText: {
    fontSize: 16,
    color: '#333',
  },
  terminalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  terminalItemText: {
    fontSize: 14,
    color: '#333',
  },
  dateItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  todayItem: {
    backgroundColor: '#f8f9fa',
  },
  dateItemText: {
    fontSize: 16,
    color: '#333',
  },
  todayItemText: {
    fontWeight: 'bold',
    color: '#667eea',
  },
});

export default RouteSelectionScreen;
