// Helper to enforce strict route validation
export const route = <T extends AppRoutePath>(
  path: AppRoute<T>
): T => path;
