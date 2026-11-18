const PASSING_PERCENTAGE = 67

function isArray(value) {
  return Array.isArray(value)
}

export function validateQuizData(data) {
  if (data === null || typeof data !== 'object' || isArray(data)) {
    return false
  }

  if (typeof data.quizTitle !== 'string' || data.quizTitle.trim() === '') {
    return false
  }

  if (!isArray(data.correctAnswers) || data.correctAnswers.length === 0) {
    return false
  }

  if (!isArray(data.attempts) || data.attempts.length === 0) {
    return false
  }

  return data.attempts.every((attempt) => (
    attempt !== null &&
    typeof attempt === 'object' &&
    !isArray(attempt) &&
    typeof attempt.name === 'string' &&
    attempt.name.trim() !== '' &&
    isArray(attempt.answers) &&
    attempt.answers.length === data.correctAnswers.length
  ))
}

export function calculateAttempt(attempt, correctAnswers) {
  let score = 0

  correctAnswers.forEach((answer, index) => {
    if (attempt.answers[index] === answer) {
      score += 1
    }
  })

  const percentage = Math.round((score / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export function calculateReport(data) {
  const attempts = data.attempts.map((attempt) => calculateAttempt(attempt, data.correctAnswers))
  const totalPercentage = attempts.reduce((total, attempt) => total + attempt.percentage, 0)
  const passedCount = attempts.filter((attempt) => attempt.passed).length
  const best = attempts.reduce((leader, attempt) => (
    attempt.score > leader.score ? attempt : leader
  ))

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
