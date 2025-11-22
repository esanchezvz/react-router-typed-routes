// Helper to enforce strict route validation
export const route = <T extends ApplicationRouter.RoutePath>(path: ApplicationRouter.Route<T>): T => path;
