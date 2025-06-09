export default function RatingScale(rate: number): string {
  if (rate >= 0 && rate <= 1) {
    return "BS (Basic)";
  } else if (rate >= 1 && rate <= 2) {
    return "ID (Intermediate)";
  } else if (rate >= 2 && rate <= 3) {
    return "UI (Upper Intermediate)";
  } else if (rate >= 3 && rate <= 4) {
    return "AD (Advanced)";
  } else if (rate >= 4 && rate <= 5) {
    return "EX (Expert)";
  } else {
    // Handle cases outside expected range

    return "";
  }
}
