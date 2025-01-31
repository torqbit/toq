import { AssignmentType, MCQAssignment, QuestionScore } from "@/types/courses/assignment";

type Answers = {
  [key: number]: string[];
};

type EvaluationResult = {
  score: number;
  isPassed: boolean;
  passingScore: number;
  maximumScore: number;
  eachQuestionScore?: QuestionScore[];
  comment: string;
};

class AssignmentEvaluationService {
  scored = 0;
  maximumScore = 0;

  constructor() {}

  evaluateMCQAssignment(
    selectedAnswers: Answers,
    maximumPoints: number,
    passingScorePercentage: number,
    assignmentDetail: MCQAssignment
  ): EvaluationResult {
    let totalQuestions = assignmentDetail.questions.length;
    let correctAnswers: Answers = {};
    let eachQuestionScore: QuestionScore[] = [];
    assignmentDetail.questions.map((question, i) => {
      correctAnswers[i + 1] = question.correctOptionIndex;
    });

    for (const questionId in correctAnswers) {
      if (correctAnswers.hasOwnProperty(questionId)) {
        const correctAnswer = correctAnswers[questionId];
        const selectedAnswer = selectedAnswers[questionId] || [];
        if (this.arraysEqual(correctAnswer, selectedAnswer)) {
          eachQuestionScore.push({ questionIndex: Number(questionId), score: maximumPoints });
          this.scored += maximumPoints;
        } else {
          eachQuestionScore.push({ questionIndex: Number(questionId), score: 0 });
        }
      }
    }

    const passingScore = (totalQuestions * maximumPoints * passingScorePercentage) / 100;
    this.maximumScore = totalQuestions * maximumPoints;
    const isPassed = this.scored >= passingScore;

    return {
      score: this.scored,
      isPassed,
      passingScore,
      maximumScore: this.maximumScore,
      eachQuestionScore,
      comment: "",
    };
  }

  evaluateSubjectiveAssignment(
    score: number,
    maximumPoints: number,
    passingScorePercentage: number,
    comment: string
  ): EvaluationResult {
    const passingScore = (maximumPoints * passingScorePercentage) / 100;
    const isPass = score >= passingScore;
    return {
      score: score,
      isPassed: isPass,
      maximumScore: maximumPoints,
      passingScore: passingScore,
      comment: comment,
    };
  }

  arraysEqual = (a: string[], b: string[]): boolean => {
    if (a.length !== b.length) return false;
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };
}

export { AssignmentType };
export type { Answers, EvaluationResult };

export default new AssignmentEvaluationService();
