export interface BaseRes<T> {
  data: T;
  ret: number;
  errCode?: any;
  errStr?: any;
  env: number;
  timestamp: number;
  success?: boolean;
}
