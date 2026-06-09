// src/ml/verdictEngine.js

/**
 * context = {
 *   percentage: number (0–100),
 *   isInconsistent: boolean,
 *   inconsistencyCount: number,
 *   phaseAtBreak: 'early' | 'improvement' | 'formation' | 'peak' | 'beast' | null
 * }
 */

export function getVerdict(context) {
  const {
    percentage = 0,
    isInconsistent = false,
    inconsistencyCount = 0,
    phaseAtBreak = null,
  } = context;

  /* =====================================================
     INCONSISTENCY OVERRIDES EVERYTHING
     Discipline breaks > percentage
  ====================================================== */

  if (isInconsistent) {
    // Multiple inconsistencies = root issue
    if (inconsistencyCount >= 3) {
      return 'This occurs due to low testosterone level';
    }

    // Broke at the top
    if (phaseAtBreak === 'peak' || phaseAtBreak === 'beast') {
      return "You are very very close to it. Don’t let it go";
    }

    // Broke while discipline was forming
    if (phaseAtBreak === 'formation') {
      return 'you are just a motivated boy but you lost, will you accept your downfall/defeat';
    }

    // Broke during improvement
    if (phaseAtBreak === 'improvement') {
      return 'Try to be on the track you are out of it';
    }

    // Broke at early momentum
    if (phaseAtBreak === 'early') {
      return "It happens due to low testosterone these types of people can't handle this phase";
    }

    // Generic inconsistency
    return 'You were inconsistent and lack of discipline';
  }

  /* =====================================================
     CONSISTENT PHASES (PERCENTAGE-BASED)
  ====================================================== */

  // Not started properly
  if (percentage < 10) {
    return 'Discipline not yet initiated';
  }

  // Early Momentum
  if (percentage >= 10 && percentage < 20) {
    return 'yeah good your are improving';
  }

  // Improvement Phase
  if (percentage >= 20 && percentage < 40) {
    return 'you are under improvement phase my boy';
  }

  // Discipline Formation Phase
  if (percentage >= 40 && percentage < 65) {
    return 'you are evolving and building the discipline';
  }

  // Peak Discipline Phase
  if (percentage >= 65 && percentage < 85) {
    return 'You are at your best at the peak of Discipline.';
  }

  // Beast Mode
  if (percentage >= 85 && percentage <= 100) {
    return 'Beast mode on';
  }

  // Absolute fallback (should almost never happen)
  return 'No clear discipline pattern detected';
}
