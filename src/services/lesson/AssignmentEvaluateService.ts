import { AssignmentType, MCQAssignment } from "@/types/courses/assignment";

type Answers = {
  [key: number]: string[];
};

type QuestionScore = {
  questionIndex: number;
  score: number;
};

type EvaluationResult = {
  totalScore: number;
  isPassed: boolean;
  passingScore: number;
  totalMarks: number;
  eachQuestionScore?: QuestionScore[];
};

class AssignmentEvaluationService {
  constructor() {}

  evaluateMCQAssignment(
    selectedAnswers: Answers,
    maximumPoints: number,
    passingScorePercentage: number,
    assignmentDetail: MCQAssignment
  ): EvaluationResult {
    let totalScore = 0;
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
          totalScore += maximumPoints;
        } else {
          eachQuestionScore.push({ questionIndex: Number(questionId), score: 0 });
        }
      }
    }

    const passingScore = (totalQuestions * maximumPoints * passingScorePercentage) / 100;
    const totalMarks = totalQuestions * maximumPoints;
    const isPassed = totalScore >= passingScore;

    return {
      totalScore,
      isPassed,
      passingScore,
      totalMarks,
      eachQuestionScore,
    };
  }

  private evaluateSubjectiveAssignment(): EvaluationResult {
    // TODO
    return {
      totalScore: 0,
      isPassed: false,
      totalMarks: 0,
      passingScore: 0,
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

export { AssignmentEvaluationService, AssignmentType };
export type { Answers, EvaluationResult };
