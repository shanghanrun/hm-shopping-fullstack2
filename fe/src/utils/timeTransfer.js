export function convertUTCtoSeoulDate(utcDateString) {
  // 주어진 UTC 문자열을 Date 객체로 변환
  const utcDate = new Date(utcDateString);

  // UTC 시간을 한국 서울 시간으로 변환
  const seoulOffset = 9 * 60; // 서울 시간은 UTC+9
  const seoulTime = new Date(utcDate.getTime() + seoulOffset * 60000);

  // 서울 시간을 YYYY-MM-DD 형식의 문자열로 변환하여 반환
  const year = seoulTime.getUTCFullYear();
  const month = String(seoulTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(seoulTime.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 예시: 주어진 UTC 날짜를 한국 서울 시간으로 변환하여 YYYY-MM-DD 형식의 문자열로 만듦
// const utcDateString = "2023-03-31";
// const seoulDate = convertUTCtoSeoulDate(utcDateString);
// console.log(seoulDate); // 출력 예시: "2023-03-31"
