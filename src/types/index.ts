export interface Terminal {
  id: string;
  name: string;
  areaCode: string;
  routeId: number;
}

export interface TerminalResponse {
  status: number;
  message: string;
  data: {
    terminalList: Terminal[];
  };
}

export interface Operation {
  id: string;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  date: string;
}

export interface OperationResponse {
  status: number;
  message: string;
  data: {
    operationMap: OperationMap;
  };
}

// 지역 코드 매핑 (01-09)
export const AREA_CODES: { [key: string]: string } = {
  '01': '특별/광역/자치',
  '02': '강원도', 
  '03': '경기도',
  '04': '경상남도',
  '05': '경상북도',
  '06': '전라남도',
  '07': '전라북도',
  '08': '충청남도',
  '09': '충청북도'
};

// 지역별로 터미널 그룹화하는 유틸리티 함수
// TODO : 지역명 수정  필요요
export const groupTerminalsByArea = (terminals: Terminal[]) => {
  const grouped: { [areaName: string]: Terminal[] } = {};
  
  // 전체 옵션 추가
  grouped['전체'] = terminals;
  
  terminals.forEach(terminal => {
    const areaName = AREA_CODES[terminal.areaCode] || '기타';
    if (!grouped[areaName]) {
      grouped[areaName] = [];
    }
    grouped[areaName].push(terminal);
  });
  
  return grouped;
};

// 날짜 관련 유틸리티 함수들
export const getDateOptions = () => {
  const options = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const dateString = `${year}-${month}-${day}`;
    const displayString = `${month}월 ${day}일`;
    
    options.push({
      value: dateString,
      label: displayString,
      isToday: i === 0
    });
  }
  
  return options;
};

// Operation 응답 구조에 맞게 인터페이스 수정
export interface OperationItem {
  departureTime: string;
  busCompany: string;
  busType: string;
  duration: string;
  price: number;
}

export interface OperationMap {
  [date: string]: OperationItem[];
}

export interface OperationResponse {
  status: number;
  message: string;
  data: {
    operationMap: OperationMap;
  };
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Alert {
  id: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  isActive: boolean;
  createdAt: Date;
  targetSeats: number;
}

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}
