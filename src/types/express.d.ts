declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: {
        userId: string;
        authProvider: string;
        roles: string[];
      };
    }
  }
}

export {};
