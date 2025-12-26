"use client";

/**
 * ProtectedLayout Component - Authentication Guard Layout
 *
 * @description Layout wrapper for protected routes that requires user authentication.
 * Used for pages like books listing, profile, favorites, etc.
 *
 * Features:
 * - Integrates with useAuthGuard hook to check authentication status
 * - Displays full-screen loading spinner while checking auth status
 * - Renders children only when authentication is confirmed
 * - Prevents unauthorized access to protected pages
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render when authenticated
 * @returns {JSX.Element} Either loading spinner or protected children content
 *
 * @example
 * // Usage in protected page layouts
 * export default function BooksLayout({ children }) {
 *   return (
 *     <ProtectedLayout>
 *       {children}
 *     </ProtectedLayout>
 *   );
 * }
 */

import useAuthGuard from "../hooks/useAuthGuard";
import FullScreenLoader from "../UI/fullScreenLoader";

export default function ProtectedLayout({ children }) {
  /**
   * Custom hook that manages authentication state and checking status
   * Returns object with:
   * - checking: boolean indicating if auth status is still being determined
   * - isAuthenticated: boolean indicating if user is logged in
   * - user: user data object (if authenticated)
   */
  const { checking } = useAuthGuard();

  /**
   * Conditional rendering based on authentication check status:
   * 1. checking === true: Show full-screen loading spinner
   * 2. checking === false: Render protected children content
   */
  if (checking) {
    // Display full-screen loader while authentication status is being verified
    // Prevents flash of protected content for unauthenticated users
    return <FullScreenLoader />;
  }

  // Once auth check completes, render the protected page content
  return <>{children}</>;
}
