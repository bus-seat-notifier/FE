import { Terminal, TerminalResponse, OperationItem, OperationMap, OperationResponse } from '../types';

//const API_BASE_URL = 'http://43.201.79.198:8080';
const API_BASE_URL = 'http://localhost:8080';

export interface BusRoute {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
}

export interface BusSchedule {
  id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}

export interface AlertRequest {
  userId: string;
  routeId: string;
  scheduleId: string;
  targetSeats: number;
  pushNotification: boolean;
  emailNotification: boolean;
}

export interface AlertResponse {
  id: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  isActive: boolean;
  createdAt: string;
  targetSeats: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 출발 터미널 조회
  async getDepartureTerminals(): Promise<Terminal[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/terminal/departure`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: TerminalResponse = await response.json();
      return result.data.terminalList;
    } catch (error) {
      console.error('Error fetching departure terminals:', error);
      // 임시 데이터 반환 (API 오류 시)
      return [
        { id: '2761001', name: '감곡', areaCode: '09', routeId: 46251 },
        { id: '5230801', name: '개치(악양)', areaCode: '06', routeId: 46252 },
        { id: '5325101', name: '거제(고현)', areaCode: '04', routeId: 46253 },
        { id: '1234567', name: '서울', areaCode: '01', routeId: 46254 },
        { id: '2345678', name: '부산', areaCode: '01', routeId: 46255 },
        { id: '3456789', name: '대구', areaCode: '01', routeId: 46256 },
        { id: '4567890', name: '인천', areaCode: '01', routeId: 46257 },
        { id: '5678901', name: '광주', areaCode: '01', routeId: 46258 },
        { id: '6789012', name: '대전', areaCode: '01', routeId: 46259 },
        { id: '7890123', name: '울산', areaCode: '01', routeId: 46260 },
        { id: '8901234', name: '세종', areaCode: '01', routeId: 46261 },
        { id: '9012345', name: '수원', areaCode: '03', routeId: 46262 },
        { id: '0123456', name: '춘천', areaCode: '02', routeId: 46263 },
        { id: '1111111', name: '청주', areaCode: '09', routeId: 46264 },
        { id: '2222222', name: '천안', areaCode: '08', routeId: 46265 },
        { id: '3333333', name: '전주', areaCode: '07', routeId: 46266 },
        { id: '4444444', name: '광주', areaCode: '06', routeId: 46267 },
        { id: '5555555', name: '포항', areaCode: '05', routeId: 46268 },
        { id: '6666666', name: '창원', areaCode: '04', routeId: 46269 },
      ];
    }
  }

  // 도착 터미널 조회
  async getArrivalTerminals(departureTerminalId: string): Promise<Terminal[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/terminal/arrival?departureTerminalId=${departureTerminalId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: TerminalResponse = await response.json();
      return result.data.terminalList;
    } catch (error) {
      console.error('Error fetching arrival terminals:', error);
      // 임시 데이터 반환 (API 오류 시)
      return [
        { id: '2761002', name: '서울', areaCode: '01', routeId: 46251 },
        { id: '5230802', name: '부산', areaCode: '01', routeId: 46252 },
        { id: '5325102', name: '대구', areaCode: '01', routeId: 46253 },
        { id: '1234568', name: '인천', areaCode: '01', routeId: 46254 },
        { id: '2345679', name: '광주', areaCode: '01', routeId: 46255 },
        { id: '3456780', name: '대전', areaCode: '01', routeId: 46256 },
        { id: '4567891', name: '울산', areaCode: '01', routeId: 46257 },
        { id: '5678902', name: '세종', areaCode: '01', routeId: 46258 },
        { id: '6789013', name: '수원', areaCode: '03', routeId: 46259 },
        { id: '7890124', name: '춘천', areaCode: '02', routeId: 46260 },
        { id: '8901235', name: '청주', areaCode: '09', routeId: 46261 },
        { id: '9012346', name: '천안', areaCode: '08', routeId: 46262 },
        { id: '0123457', name: '전주', areaCode: '07', routeId: 46263 },
        { id: '1111112', name: '광주', areaCode: '06', routeId: 46264 },
        { id: '2222223', name: '포항', areaCode: '05', routeId: 46265 },
        { id: '3333334', name: '창원', areaCode: '04', routeId: 46266 },
      ];
    }
  }

  // 특정 노선의 운행 정보 조회 (routeId만 사용)
  async getOperationsByRoute(routeId: number): Promise<OperationMap> {
    try {
      const response = await fetch(`${this.baseURL}/api/operation/?routeId=${routeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: OperationResponse = await response.json();
      return result.data.operationMap;
    } catch (error) {
      console.error('Error fetching operations by route:', error);
      // 임시 데이터 반환 (API 오류 시) - 오늘부터 30일 후까지
      const today = new Date();
      const operationMap: OperationMap = {};
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        
        operationMap[dateString] = [
          {
            departureTime: '22:00:00',
            busCompany: '경원여객',
            busType: '프리미엄',
            duration: '4:20',
            price: 49400
          },
          {
            departureTime: '22:00:00',
            busCompany: '경원여객',
            busType: '심야우등',
            duration: '4:20',
            price: 48800
          },
          {
            departureTime: '06:00:00',
            busCompany: '대한고속',
            busType: '일반',
            duration: '4:30',
            price: 45000
          },
          {
            departureTime: '08:00:00',
            busCompany: '동양고속',
            busType: '우등',
            duration: '4:15',
            price: 47000
          }
        ];
      }
      
      return operationMap;
    }
  }

  // 모든 버스 노선 가져오기 (기존 메서드 - 하위 호환성을 위해 유지)
  async getBusRoutes(): Promise<BusRoute[]> {
    try {
      // 먼저 출발 터미널을 가져옴
      const departureTerminals = await this.getDepartureTerminals();
      
      // 각 출발 터미널에 대해 도착 터미널을 가져와서 노선 정보 생성
      const routes: BusRoute[] = [];
      
      for (const departureTerminal of departureTerminals) {
        const arrivalTerminals = await this.getArrivalTerminals(departureTerminal.id);
        
        for (const arrivalTerminal of arrivalTerminals) {
          routes.push({
            id: departureTerminal.routeId.toString(),
            name: `${departureTerminal.name} - ${arrivalTerminal.name}`,
            departure: departureTerminal.name,
            arrival: arrivalTerminal.name,
            duration: '4시간 30분', // 실제로는 운행 정보에서 계산해야 함
          });
        }
      }
      
      return routes;
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      // 임시 데이터 반환 (API 오류 시)
      return [
        { id: '1', name: '서울-부산', departure: '서울', arrival: '부산', duration: '4시간 30분' },
        { id: '2', name: '서울-대구', departure: '서울', arrival: '대구', duration: '3시간 30분' },
        { id: '3', name: '서울-인천', departure: '서울', arrival: '인천', duration: '1시간' },
        { id: '4', name: '부산-대구', departure: '부산', arrival: '대구', duration: '2시간 30분' },
        { id: '5', name: '대구-인천', departure: '대구', arrival: '인천', duration: '4시간' },
      ];
    }
  }

  // 특정 노선의 스케줄 가져오기 (기존 메서드 수정)
  async getBusSchedules(routeId: string, date: string): Promise<BusSchedule[]> {
    try {
      const operations = await this.getOperationsByRoute(parseInt(routeId));
      
      // Operation을 BusSchedule 형태로 변환
      const schedules: BusSchedule[] = [];
      const dateOperations = operations[date] || [];
      
      dateOperations.forEach((operation, index) => {
        schedules.push({
          id: `${routeId}_${date}_${index}`,
          routeId: routeId,
          departureTime: operation.departureTime,
          arrivalTime: '도착시간', // 실제로는 계산 필요
          availableSeats: Math.floor(Math.random() * 10), // 임시 데이터
          totalSeats: 45,
          price: operation.price,
        });
      });
      
      return schedules;
    } catch (error) {
      console.error('Error fetching bus schedules:', error);
      // 임시 데이터 반환 (API 오류 시)
      return [
        { id: '1', routeId, departureTime: '06:00', arrivalTime: '10:30', availableSeats: 5, totalSeats: 45, price: 15000 },
        { id: '2', routeId, departureTime: '07:00', arrivalTime: '11:30', availableSeats: 0, totalSeats: 45, price: 15000 },
        { id: '3', routeId, departureTime: '08:00', arrivalTime: '12:30', availableSeats: 3, totalSeats: 45, price: 15000 },
        { id: '4', routeId, departureTime: '09:00', arrivalTime: '13:30', availableSeats: 8, totalSeats: 45, price: 15000 },
        { id: '5', routeId, departureTime: '10:00', arrivalTime: '14:30', availableSeats: 2, totalSeats: 45, price: 15000 },
      ];
    }
  }

  // 알림 설정 생성
  async createAlert(alertData: AlertRequest): Promise<AlertResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      // 임시 응답 반환 (API 오류 시)
      return {
        id: Date.now().toString(),
        userId: alertData.userId,
        routeId: alertData.routeId,
        scheduleId: alertData.scheduleId,
        isActive: true,
        createdAt: new Date().toISOString(),
        targetSeats: alertData.targetSeats,
      };
    }
  }

  // 사용자의 알림 목록 가져오기
  async getUserAlerts(userId: string): Promise<AlertResponse[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/users/${userId}/alerts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user alerts:', error);
      // 임시 데이터 반환 (API 오류 시)
      return [
        {
          id: '1',
          userId,
          routeId: '1',
          scheduleId: '7',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          targetSeats: 2,
        },
        {
          id: '2',
          userId,
          routeId: '2',
          scheduleId: '3',
          isActive: true,
          createdAt: '2024-01-16T09:00:00Z',
          targetSeats: 1,
        },
      ];
    }
  }

  // 알림 상태 변경
  async updateAlertStatus(alertId: string, isActive: boolean): Promise<AlertResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating alert status:', error);
      throw error;
    }
  }

  // 알림 삭제
  async deleteAlert(alertId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/alerts/${alertId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  // 카카오 로그인 (실제 구현 시 카카오 SDK와 연동)
  async kakaoLogin(accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/kakao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error with Kakao login:', error);
      // 임시 사용자 데이터 반환
      return {
        id: 'user123',
        name: '홍길동',
        email: 'hong@example.com',
        accessToken: 'temp_token_' + Date.now(),
      };
    }
  }
}

export const apiService = new ApiService();

