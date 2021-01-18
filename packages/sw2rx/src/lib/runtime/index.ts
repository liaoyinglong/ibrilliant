import { Observable, of } from "rxjs";
import { ajax, AjaxRequest, AjaxResponse } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";

import { wrapperedQs as qs } from "@ibrilliant/utils";
export { wrapperedQs as qs } from "@ibrilliant/utils";

export interface BaseRes<T> {
  data: T;
  ret: number;
  errCode?: any;
  errStr?: any;
  env: number;
  timestamp: number;
  success?: boolean;
}

export interface ConfigurationParameters {
  basePath?: string | (() => string);
  middleware?: Middleware;
}

/**
 * This is the base class for all generated API classes.
 */
export class BaseAPI {
  private static defaultMiddleware: Middleware = {};
  private static defaultBasePath =
    typeof window !== "undefined" ? window.location.origin : "";

  static setDefaultMiddleware(middleware: Middleware) {
    BaseAPI.defaultMiddleware = middleware;
  }

  constructor(private config: ConfigurationParameters) {}

  get basePath(): string {
    const { basePath } = this.config;
    if (typeof basePath === "function") {
      return basePath();
    }
    return basePath ?? BaseAPI.defaultBasePath;
  }
  get middleware(): Middleware {
    return this.config?.middleware ?? BaseAPI.defaultMiddleware;
  }

  protected request = <T>(requestOpts: RequestOpts): Observable<BaseRes<T>> => {
    let url = this.basePath + requestOpts.path;

    const params = {
      url,
      query: requestOpts.query,
      method: requestOpts.method,
      headers: requestOpts.headers,
      body: requestOpts.body,
      responseType: requestOpts.responseType || "json",
    };

    return this.rxjsRequest(params).pipe(
      map((ajaxRes) => {
        ajaxRes.response = ajaxRes.response ?? { data: {} };
        ajaxRes = this.middleware?.post(ajaxRes) ?? ajaxRes;
        return ajaxRes?.response;
      })
    );
  };

  private rxjsRequest = (params: RequestArgs): Observable<AjaxResponse> => {
    params = this.middleware?.pre(params) ?? params;

    const { query, ...otherArgs } = params;
    if (query) {
      otherArgs.url = `${otherArgs.url}${qs.stringify(query)}`;
    }
    if (otherArgs.body) {
      otherArgs.body =
        otherArgs.body instanceof FormData
          ? otherArgs.body
          : JSON.stringify(otherArgs.body);
    }

    return ajax(otherArgs).pipe(
      catchError((err) => {
        err.response = err.response ?? { data: {} };
        return of(err);
      })
    );
  };
}

/**
 * @deprecated
 * export for not being a breaking change
 */
export class RequiredError extends Error {
  name: "RequiredError" = "RequiredError";
}

export const COLLECTION_FORMATS = {
  csv: ",",
  ssv: " ",
  tsv: "\t",
  pipes: "|",
};

export type Json = any;
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";
export type HttpHeaders = { [key: string]: string };
export type HttpQuery = Partial<{
  [key: string]:
    | string
    | number
    | null
    | boolean
    | Array<string | number | null | boolean>;
}>; // partial is needed for strict mode
export type HttpBody = Json | FormData;

export interface RequestOpts {
  path: string;
  method: HttpMethod;
  headers?: HttpHeaders;
  query?: HttpQuery;
  body?: HttpBody;
  responseType?: XMLHttpRequestResponseType;
}

export const encodeURI = (value: any) => encodeURIComponent(String(value));

/**
 * 生成出来的代码可能会依赖
 */
export const throwIfRequired = (
  params: { [key: string]: any },
  key: string,
  nickname: string
) => {
  if (!params || params[key] == null) {
    throw new RequiredError(
      `Required parameter ${key} was null or undefined when calling ${nickname}.`
    );
  }
};
/**
 * 生成出来的代码可能会依赖
 */
export const throwIfNullOrUndefined = (value: any, nickname?: string) => {
  if (value == null) {
    throw new Error(
      `Parameter "${value}" was null or undefined when calling "${nickname}".`
    );
  }
};

// alias for easier importing
export interface RequestArgs extends AjaxRequest {
  query?: HttpQuery;
  headers?: HttpHeaders;
}
export interface ResponseArgs extends AjaxResponse {}

export interface Middleware {
  pre?(request: RequestArgs): RequestArgs;
  post?(response: ResponseArgs): ResponseArgs;
}
