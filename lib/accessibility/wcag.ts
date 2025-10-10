/**
 * WCAG 2.1 Accessibility Utilities
 * أدوات إمكانية الوصول حسب معايير WCAG 2.1
 */

/**
 * Check color contrast ratio (WCAG AA/AAA)
 * @param foreground - Foreground color in hex
 * @param background - Background color in hex
 * @returns Contrast ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  const L1 = getLuminance(foreground);
  const L2 = getLuminance(background);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);

  if (!rgb) {
    return 0;
  }

  const [r = 0, g = 0, b = 0] = rgb.map((val) => {
    const normalized = val / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? [
        parseInt(result[1] || '0', 16),
        parseInt(result[2] || '0', 16),
        parseInt(result[3] || '0', 16),
      ]
    : null;
}

/**
 * Check if contrast meets WCAG AA standards
 * - Normal text: 4.5:1
 * - Large text: 3:1
 */
export function meetsWCAG_AA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 3 : 4.5;

  return ratio >= threshold;
}

/**
 * Check if contrast meets WCAG AAA standards
 * - Normal text: 7:1
 * - Large text: 4.5:1
 */
export function meetsWCAG_AAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 4.5 : 7;

  return ratio >= threshold;
}

/**
 * ARIA attributes helper
 */
export interface AriaProps {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
}

/**
 * Generate ARIA attributes for button
 */
export function getButtonAriaProps(config: {
  label: string;
  pressed?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  controls?: string;
}): AriaProps {
  const { label, pressed, expanded, disabled, controls } = config;

  const props: any = {
    'aria-label': label,
  };

  if (pressed !== undefined) {
    props['aria-pressed'] = pressed;
  }

  if (expanded !== undefined) {
    props['aria-expanded'] = expanded;
  }

  if (disabled) {
    props['aria-disabled'] = true;
  }

  if (controls) {
    props['aria-controls'] = controls;
  }

  return props;
}

/**
 * Generate ARIA attributes for input
 */
export function getInputAriaProps(config: {
  label: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
}): AriaProps {
  const { label, describedBy, required, invalid, errorMessage } = config;

  const props: AriaProps = {
    'aria-label': label,
  };

  if (describedBy) {
    props['aria-describedby'] = describedBy;
  }

  if (required) {
    props['aria-required'] = true;
  }

  if (invalid) {
    props['aria-invalid'] = true;

    if (errorMessage) {
      props['aria-describedby'] = `${describedBy || ''} error-${label}`.trim();
    }
  }

  return props;
}

/**
 * Focus trap helper
 */
export class FocusTrap {
  private container: HTMLElement;
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableElements = this.container.querySelectorAll(
      focusableSelectors.join(', ')
    ) as NodeListOf<HTMLElement>;

    this.firstFocusable = focusableElements[0] || null;
    this.lastFocusable = focusableElements[focusableElements.length - 1] || null;
  }

  handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  }

  activate() {
    this.firstFocusable?.focus();
  }
}

/**
 * Skip to main content link helper
 */
export function createSkipLink(targetId: string): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only';
  skipLink.textContent = 'Skip to main content';

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    target?.focus();
    target?.scrollIntoView();
  });

  return skipLink;
}

/**
 * Screen reader only text utility
 */
export function createSROnlyText(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Keyboard navigation helper
 */
export class KeyboardNavigationHelper {
  static KEYS = {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End',
    TAB: 'Tab',
  };

  static isNavigationKey(key: string): boolean {
    return Object.values(this.KEYS).includes(key);
  }

  static handleMenuNavigation(
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number
  ): number {
    let newIndex = currentIndex;

    switch (e.key) {
      case this.KEYS.ARROW_DOWN:
        e.preventDefault();
        newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
        break;

      case this.KEYS.ARROW_UP:
        e.preventDefault();
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;

      case this.KEYS.HOME:
        e.preventDefault();
        newIndex = 0;
        break;

      case this.KEYS.END:
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    items[newIndex]?.focus();
    return newIndex;
  }
}

/**
 * Image alt text validator
 */
export function validateAltText(altText: string): { valid: boolean; message?: string } {
  if (!altText || altText.trim().length === 0) {
    return { valid: false, message: 'Alt text is required for images' };
  }

  if (altText.length < 3) {
    return { valid: false, message: 'Alt text should be more descriptive' };
  }

  if (altText.length > 125) {
    return {
      valid: false,
      message: 'Alt text should be concise (under 125 characters)',
    };
  }

  // Check for redundant phrases
  const redundantPhrases = ['image of', 'picture of', 'photo of', 'صورة', 'صوره'];
  const lowerAlt = altText.toLowerCase();

  if (redundantPhrases.some((phrase) => lowerAlt.startsWith(phrase))) {
    return {
      valid: false,
      message: 'Avoid redundant phrases like "image of" in alt text',
    };
  }

  return { valid: true };
}

/**
 * Heading hierarchy validator
 */
export function validateHeadingHierarchy(): Array<{ level: number; text: string; issue?: string }> {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const results: Array<{ level: number; text: string; issue?: string }> = [];

  let previousLevel = 0;

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    const text = heading.textContent || '';

    const result: { level: number; text: string; issue?: string } = {
      level,
      text: text.substring(0, 50),
    };

    // Check for skipped levels
    if (level > previousLevel + 1) {
      result.issue = `Skipped heading level (jumped from H${previousLevel} to H${level})`;
    }

    // Check for missing H1
    if (level === 1 && results.filter((r) => r.level === 1).length > 0) {
      result.issue = 'Multiple H1 tags found (should have only one)';
    }

    results.push(result);
    previousLevel = level;
  });

  return results;
}

/**
 * Form accessibility validator
 */
export function validateFormAccessibility(form: HTMLFormElement): Array<string> {
  const issues: string[] = [];

  // Check all inputs have labels
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');

    if (!id && !ariaLabel && !ariaLabelledBy) {
      issues.push(`Input "${(input as HTMLInputElement).name}" lacks accessible label`);
    }

    if (id) {
      const label = form.querySelector(`label[for="${id}"]`);
      if (!label && !ariaLabel && !ariaLabelledBy) {
        issues.push(`Input "${id}" has no associated label`);
      }
    }
  });

  // Check required fields have aria-required
  const requiredInputs = form.querySelectorAll('[required]');

  requiredInputs.forEach((input) => {
    if (!input.hasAttribute('aria-required')) {
      issues.push(`Required input "${(input as HTMLInputElement).name}" missing aria-required`);
    }
  });

  return issues;
}
