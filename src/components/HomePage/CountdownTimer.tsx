// import React, { useState, useEffect } from "react";

// // Define the shape of the props
// interface CountdownTimerProps {
//   targetDate?: string | Date; // Optional target date (string or Date object)
//   initialDays?: number; // Optional initial days
//   initialHours?: number; // Optional initial hours
//   initialMinutes?: number; // Optional initial minutes
//   initialSeconds?: number; // Optional initial seconds
// }

// // Define the shape of the timeLeft state
// interface TimeLeft {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// const CountdownTimer: React.FC<CountdownTimerProps> = ({
//   targetDate,
//   initialDays = 0,
//   initialHours = 0,
//   initialMinutes = 0,
//   initialSeconds = 0,
// }) => {
//   const [timeLeft, setTimeLeft] = useState<TimeLeft>({
//     days: initialDays,
//     hours: initialHours,
//     minutes: initialMinutes,
//     seconds: initialSeconds,
//   });

//   useEffect(() => {
//     // If a target date is provided, calculate initial time difference
//     if (targetDate) {
//       const calculateTimeLeft = (): TimeLeft => {
//         const difference = new Date(targetDate).getTime() - new Date().getTime();

//         if (difference > 0) {
//           return {
//             days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//             hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//             minutes: Math.floor((difference / 1000 / 60) % 60),
//             seconds: Math.floor((difference / 1000) % 60),
//           };
//         }
//         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       };

//       setTimeLeft(calculateTimeLeft());

//       // Update the countdown every second
//       const timer = setInterval(() => {
//         const timeRemaining = calculateTimeLeft();
//         setTimeLeft(timeRemaining);

//         // Clear interval when the countdown reaches zero
//         if (Object.values(timeRemaining).every((value) => value === 0)) {
//           clearInterval(timer);
//         }
//       }, 1000);

//       // Cleanup interval on component unmount
//       return () => clearInterval(timer);
//     }
//   }, [targetDate]);

//   // Helper function to pad numbers with leading zeros
//   const padWithZero = (num: number): string => {
//     return num.toString().padStart(2, "0");
//   };

//   return (
//     <div className="flex items-center font-bold">
//       {/* Days */}
//       <div className="flex flex-col items-center min-w-0">
//         <span className="text-xs sm:text-sm text-gray-500 mb-1">Days</span>
//         <div className="bg-white rounded-lg shadow-sm border px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
//           <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 block text-center">
//             {padWithZero(timeLeft.days)}
//           </span>
//         </div>
//       </div>
      
//       {/* Separator */}
//       <div className="flex flex-col items-center mx-1 sm:mx-2">
//         <div className="h-4 sm:h-6"></div>
//         <span className="text-lg sm:text-2xl lg:text-3xl text-red-500 font-bold">:</span>
//       </div>
      
//       {/* Hours */}
//       <div className="flex flex-col items-center min-w-0">
//         <span className="text-xs sm:text-sm text-gray-500 mb-1">Hours</span>
//         <div className="bg-white rounded-lg shadow-sm border px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
//           <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 block text-center">
//             {padWithZero(timeLeft.hours)}
//           </span>
//         </div>
//       </div>
      
//       {/* Separator */}
//       <div className="flex flex-col items-center mx-1 sm:mx-2">
//         <div className="h-4 sm:h-6"></div>
//         <span className="text-lg sm:text-2xl lg:text-3xl text-red-500 font-bold">:</span>
//       </div>
      
//       {/* Minutes */}
//       <div className="flex flex-col items-center min-w-0">
//         <span className="text-xs sm:text-sm text-gray-500 mb-1">Minutes</span>
//         <div className="bg-white rounded-lg shadow-sm border px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
//           <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 block text-center">
//             {padWithZero(timeLeft.minutes)}
//           </span>
//         </div>
//       </div>
      
//       {/* Separator */}
//       <div className="flex flex-col items-center mx-1 sm:mx-2">
//         <div className="h-4 sm:h-6"></div>
//         <span className="text-lg sm:text-2xl lg:text-3xl text-red-500 font-bold">:</span>
//       </div>
      
//       {/* Seconds */}
//       <div className="flex flex-col items-center min-w-0">
//         <span className="text-xs sm:text-sm text-gray-500 mb-1">Seconds</span>
//         <div className="bg-white rounded-lg shadow-sm border px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
//           <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-500 block text-center animate-pulse">
//             {padWithZero(timeLeft.seconds)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountdownTimer;


import React, { useState, useEffect } from "react";

// Define the shape of the props
interface CountdownTimerProps {
  targetDate?: string | Date; // Optional target date (string or Date object)
  initialDays?: number; // Optional initial days
  initialHours?: number; // Optional initial hours
  initialMinutes?: number; // Optional initial minutes
  initialSeconds?: number; // Optional initial seconds
}

// Define the shape of the timeLeft state
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  initialDays = 0,
  initialHours = 0,
  initialMinutes = 0,
  initialSeconds = 0,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: initialDays,
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    // If a target date is provided, calculate initial time difference
    if (targetDate) {
      const calculateTimeLeft = (): TimeLeft => {
        const difference = new Date(targetDate).getTime() - new Date().getTime();

        if (difference > 0) {
          return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      };

      setTimeLeft(calculateTimeLeft());

      // Update the countdown every second
      const timer = setInterval(() => {
        const timeRemaining = calculateTimeLeft();
        setTimeLeft(timeRemaining);

        // Clear interval when the countdown reaches zero
        if (Object.values(timeRemaining).every((value) => value === 0)) {
          clearInterval(timer);
        }
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(timer);
    }
  }, [targetDate]);

  // Helper function to pad numbers with leading zeros
  const padWithZero = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex items-center justify-center">
      {/* Days */}
      <div className="text-center">
        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Days</div>
        <div className="text-xl sm:text-4xl font-bold text-black">
          {padWithZero(timeLeft.days)}
        </div>
      </div>
      
      {/* Separator */}
      <div className="mx-2 sm:mx-4 lg:mx-6 text-2xl sm:text-4xl  font-bold text-black self-end pb-1 sm:pb-2">
        :
      </div>
      
      {/* Hours */}
      <div className="text-center">
        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Hours</div>
        <div className="text-xl sm:text-4xl font-bold text-black">
          {padWithZero(timeLeft.hours)}
        </div>
      </div>
      
      {/* Separator */}
      <div className="mx-2 sm:mx-4 lg:mx-6 text-2xl sm:text-4xl  font-bold text-black self-end pb-1 sm:pb-2">
        :
      </div>
      
      {/* Minutes */}
      <div className="text-center">
        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Minutes</div>
        <div className="text-xl sm:text-4xl font-bold text-black">
          {padWithZero(timeLeft.minutes)}
        </div>
      </div>
      
      {/* Separator */}
      <div className="mx-2 sm:mx-4 lg:mx-6 text-2xl sm:text-4xl  font-bold text-black self-end pb-1 sm:pb-2">
        :
      </div>
      
      {/* Seconds */}
      <div className="text-center">
        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Seconds</div>
        <div className="text-xl sm:text-4xl font-bold text-black">
          {padWithZero(timeLeft.seconds)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;