export default function RatingScale(rate: number): string {
  if (rate >= 0 && rate <= 1) {
    return "Unsatisfactory";
  } else if (rate >= 1 && rate <= 2) {
    return "Needs Improvement";
  } else if (rate >= 2 && rate <= 3) {
    return "Meets Expectations";
  } else if (rate >= 3 && rate <= 4) {
    return "Eceeds Expectations";
  } else if (rate >= 4 && rate <= 5) {
    return "Outstanding";
  } else {
    // Handle cases outside expected range

    return "";
  }
}
