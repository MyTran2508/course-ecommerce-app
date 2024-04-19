import { Cart } from "@/types/cart.type";
import { Lecture, Section } from "@/types/section.type";
import path from "path";

export const totalPrice = (carts: Cart[]) => {
  const checkedItems = carts.filter((item) => item.checked);

  const totalPrice = checkedItems.reduce(
    (total, item) => total + item.price,
    0
  );

  return totalPrice;
};

export const convertVNDtoUSD = (moneyVND: number) => {
  const exchangeRate = 24580;

  const convertedAmount = (moneyVND / exchangeRate).toFixed(1);

  return parseFloat(convertedAmount);
};

export const isURLValid = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const checkFileExtension = (file: File): boolean => {
  const allowedExtensions: string[] = ["mp4"];
  const fileName: string = file.name;
  const fileExtension: string = fileName.split(".").pop()!.toLowerCase();
  return allowedExtensions.includes(fileExtension);
};

export const handleGetDurationFormVideo = async (file: File) => {
  if (checkFileExtension(file)) {
    const videoElement = document.createElement("video");
    const videoURL = URL.createObjectURL(file);
    videoElement.src = videoURL;

    await new Promise<void>((resolve) => {
      videoElement.addEventListener("loadedmetadata", () => {
        resolve();
      });
    });

    return Math.round(videoElement.duration);
  }

  return 0;
};

export const handleCountFieldsInSection = (
  array: Section[] | null
): { totalLectureCount: number; totalDurationCourse: string } => {
  if (array) {
    const lectureCounts = array.map((section) => {
      const filteredLectures = (
        (section as Section)?.lectures as Lecture[]
      ).filter((lecture) => lecture.ordinalNumber !== -1);
      return filteredLectures.length;
    });

    const totalLectureCount = lectureCounts.reduce(
      (acc, count) => acc + count,
      0
    );

    const totalDurationCourse: string = convertLongToTime(
      array.reduce((total, section) => {
        const sectionDuration: number = (section.lectures as Lecture[]).reduce(
          (sectionTotal, lecture) =>
            sectionTotal + (lecture.videoDuration as number),
          0
        );
        return total + sectionDuration;
      }, 0)
    );

    return {
      totalLectureCount: totalLectureCount,
      totalDurationCourse: totalDurationCourse,
    };
  }
  return { totalLectureCount: 0, totalDurationCourse: "0" };
};

export const convertLongToTime = (
  longValue: number,
  showHoursMinutesSeconds: boolean = false,
  showSeconds: boolean = true
): string => {
  if (!longValue) return "";
  const date = new Date(longValue * 1000);
  const timeString = date.toISOString().substr(11, 8);

  if (!showSeconds) {
    return timeString.slice(0, -3);
  }

  if (showHoursMinutesSeconds) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return `${hours}h ${minutes}p ${seconds}s`;
  }

  if (timeString.startsWith("00")) {
    return timeString.substr(3);
  }

  return timeString;
};

export function extractId(message: string) {
  const parts = message.split(": ");
  return parts[1];
}

export const getCurrentTimeInMillisecondsFromAPI = async () => {
  const response = await fetch(
    "http://worldtimeapi.org/api/timezone/Asia/Ho_Chi_Minh"
  );
  const data = await response.json();
  const date = new Date(data.datetime);
  return date.getTime();
};

export const convertToMilliseconds = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return (hours * 60 * 60 + minutes * 60) * 1000;
};

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const hours = h < 10 ? "0" + h : h;
  const minutes = m < 10 ? "0" + m : m;
  const secs = s < 10 ? "0" + s : s;

  return `${hours}:${minutes}:${secs}`;
}
