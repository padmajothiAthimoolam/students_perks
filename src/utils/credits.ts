export function calculateCredits(marks: number, maximumMarks: number): number {
  if (maximumMarks <= 0) return 0;

  const percentage = (marks / maximumMarks) * 100;

  if (percentage >= 90) return 20;
  if (percentage >= 80) return 15;
  if (percentage >= 70) return 10;
  if (percentage >= 60) return 5;
  return 0;
}

export function calculatePercentage(marks: number, maximumMarks: number): number {
  if (maximumMarks <= 0) return 0;
  return Number(((marks / maximumMarks) * 100).toFixed(1));
}
