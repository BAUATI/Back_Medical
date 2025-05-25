export interface ApiResponse<T> {
    ok: boolean;
    msg: string;
    data?: T;
  }