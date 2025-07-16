/**
 * Converts a snake_case string to a space-separated string with only the first word capitalized.
 */
export function snakeToTitleCase(str: string): string {
  const spaced = str.split('_').join(' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Returns the uppercase initials of the input string (first character of each word).
 * If maxLength is a positive integer, the result is sliced to that length; otherwise, the full initials are returned.
 * Example: getInitials('john doe') => 'JD'
 */
export function getInitials(str: string, maxLength?: number) {
  const initials = str
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
  return typeof maxLength === 'number' &&
    Number.isInteger(maxLength) &&
    maxLength > 0
    ? initials.slice(0, maxLength)
    : initials;
}

/**
 * Converts a camelCase string to a space-separated string with each word capitalized.
 * If a word has multiple uppercase letters (e.g., 'HTMLParser'), it keeps them.
 * Example: camelToWords('myHTMLParser') => 'My HTML Parser'
 */
export function camelToWords(str: string): string {
  return (
    str
      // Add space before uppercase letters, except for consecutive uppercase
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      // Split into words
      .split(' ')
      // Capitalize the first letter of each word, keep all-uppercase words unchanged
      .map((word) =>
        word === word.toUpperCase()
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(' ')
  );
}
