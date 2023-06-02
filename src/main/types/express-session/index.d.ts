declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
    supplier_qa_url: any;
  }
}

export {};
