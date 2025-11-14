import React from 'react';

// Using distinct icons for male and female patients for clearer visual identification.
const MaleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const FemaleIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0A18.75 18.75 0 0 1 12 22.5c-2.793 0-5.49-.606-7.5-1.75Z" />
  </svg>
);


const PatientContext: React.FC = () => {
  // 환자 정보를 객체로 관리하여 성별에 따른 UI 변경을 용이하게 합니다.
  const patient = {
    name: '이사라',
    id: '1234567',
    age: 7,
    gender: '여', // '남' for Male, '여' for Female
    status: '가정용 인공호흡기 (Trilogy Evo Philips) 사용 중',
  };

  const isMale = patient.gender === '남';

  // 성별에 따라 다른 색상 테마를 적용합니다.
  const theme = {
    container: isMale ? 'bg-blue-50 border-blue-200' : 'bg-pink-50 border-pink-200',
    iconContainer: isMale ? 'bg-blue-200' : 'bg-pink-200',
    icon: isMale ? 'text-blue-700' : 'text-pink-700',
    genderBadge: isMale ? 'bg-blue-200 text-blue-800' : 'bg-pink-200 text-pink-800',
  };

  return (
    <div className={`border ${theme.container} rounded-lg p-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <div className={`${theme.iconContainer} p-2 rounded-full`}>
             {isMale ? 
                <MaleIcon className={`h-6 w-6 ${theme.icon}`} /> :
                <FemaleIcon className={`h-6 w-6 ${theme.icon}`} />
             }
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">현재 환자: {patient.name} (ID: {patient.id})</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">나이/성별:</span> {patient.age}세 / 
              <span className={`px-2 py-0.5 ml-1 rounded-full text-xs font-semibold ${theme.genderBadge}`}>
                  {patient.gender}
              </span>
              <span className="mx-2">|</span>
              <span className="font-medium">상태:</span> {patient.status}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors text-sm">
            환자 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientContext;