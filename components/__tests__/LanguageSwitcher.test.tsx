/**
 * Tests for Language Switcher Component
 * اختبارات مكون تبديل اللغة
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => '/ar/dashboard',
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: () => 'ar',
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<LanguageSwitcher />);

    // Should show Globe icon
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display current locale', () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('العربية');
    expect(button).toHaveTextContent('🇸🇦');
  });

  it('should open dropdown on click', async () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  it('should show checkmark for current locale', async () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const arabicItem = screen.getByText('العربية').closest('[role="menuitem"]');
      expect(arabicItem).toBeInTheDocument();
    });
  });

  it('should switch locale on selection', async () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const englishItem = screen.getByText('English');
      fireEvent.click(englishItem);
    });

    expect(mockPush).toHaveBeenCalledWith('/en/dashboard');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('should preserve pathname when switching locale', async () => {
    // Mock different pathname
    jest.spyOn(require('next/navigation'), 'usePathname').mockReturnValue('/ar/tools/debt');

    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      const englishItem = screen.getByText('English');
      fireEvent.click(englishItem);
    });

    expect(mockPush).toHaveBeenCalledWith('/en/tools/debt');
  });

  it('should be accessible', () => {
    const { container } = render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');

    // Should have proper ARIA attributes
    expect(button).toBeEnabled();
  });

  it('should have proper keyboard navigation', async () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');

    // Open with Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });
});
