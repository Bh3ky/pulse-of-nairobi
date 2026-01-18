// /utils/time.ts

export const formatTime = (decimalTime: number): string => {
    let normalizedTime = decimalTime % 24;
    if (normalizedTime < 0) normalizedTime += 24;
    
    const hours = Math.floor(normalizedTime);
    const minutes = Math.floor((normalizedTime - hours) * 60);

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${period}`;

};

export const calculateCurrentTime = (start: number, end: number, progress: number) => {
    let duration = end - start;
    if (duration < 0) {
        duration = (24 - start) + end;
    }
    return start + (duration * progress);
};