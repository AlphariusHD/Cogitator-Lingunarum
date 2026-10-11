export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * Lightweight word-level text diff calculator without external heavy libraries
 */
export function computeWordDiff(oldText: string, newText: string): DiffPart[] {
  if (!oldText) {
    return [{ value: newText, added: true }];
  }
  if (!newText) {
    return [{ value: oldText, removed: true }];
  }
  if (oldText === newText) {
    return [{ value: newText }];
  }

  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  const diff: DiffPart[] = [];
  let i = 0;
  let j = 0;

  while (i < oldWords.length && j < newWords.length) {
    if (oldWords[i] === newWords[j]) {
      diff.push({ value: newWords[j] });
      i++;
      j++;
    } else {
      // Look ahead to see if word matches soon
      let matchInOld = -1;
      let matchInNew = -1;

      for (let k = 1; k < 6; k++) {
        if (i + k < oldWords.length && oldWords[i + k] === newWords[j]) {
          matchInOld = i + k;
          break;
        }
        if (j + k < newWords.length && oldWords[i] === newWords[j + k]) {
          matchInNew = j + k;
          break;
        }
      }

      if (matchInOld !== -1) {
        // Words in old were removed
        while (i < matchInOld) {
          diff.push({ value: oldWords[i], removed: true });
          i++;
        }
      } else if (matchInNew !== -1) {
        // Words in new were added
        while (j < matchInNew) {
          diff.push({ value: newWords[j], added: true });
          j++;
        }
      } else {
        diff.push({ value: oldWords[i], removed: true });
        diff.push({ value: newWords[j], added: true });
        i++;
        j++;
      }
    }
  }

  while (i < oldWords.length) {
    diff.push({ value: oldWords[i], removed: true });
    i++;
  }

  while (j < newWords.length) {
    diff.push({ value: newWords[j], added: true });
    j++;
  }

  return diff;
}
