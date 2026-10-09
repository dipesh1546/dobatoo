import type { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

// Logo Component Props
export type LogoVariant = 'default' | 'light' | 'dark' | 'compact';
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

// Button Component Props
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

// Container Component Props
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

// Section Component Props
export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: 'dark' | 'plum' | 'gradient' | 'soft' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
}

// Heading Component Props
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingFont = 'sans' | 'serif';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  fontFamily?: HeadingFont;
  gradient?: boolean;
  gradientVariant?: 'primary' | 'romantic';
  className?: string;
  children: ReactNode;
}

// GradientText Component Props
export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'romantic' | 'glow';
  children: ReactNode;
  className?: string;
}

// Card Component Props
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'glass' | 'elevated' | 'bordered' | 'flat';
  hoverEffect?: boolean;
  glow?: boolean;
  className?: string;
}

// Badge Component Props
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'primary' | 'romantic' | 'outline' | 'dark' | 'glass';
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
}

// Modal Component Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// LoadingSpinner Component Props
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}
