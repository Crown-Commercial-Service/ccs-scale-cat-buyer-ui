declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
    [key: string]: any
  }
}

export {};
