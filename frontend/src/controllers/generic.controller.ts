import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import formatUrl from "../util/formatUrl";

export type ControllerParamsHeaders = {
  params?: Record<string, any>;
  headers?: any;
};

class GenericController {
  private mainUri: string;

  private servicePath: string;

  constructor(mainUri: string, servicePath?: string) {
    this.mainUri = formatUrl(mainUri);
    this.servicePath = servicePath ? formatUrl(servicePath) : "";
  }

  private getUri(routePath: string): string {
    return this.servicePath === ""
      ? `${this.mainUri}/${routePath}`
      : `${this.mainUri}/${this.servicePath}/${routePath}`;
  }

  public async get<T, R = AxiosResponse<T>>(
    routePath: string,
    paramsHeader?: ControllerParamsHeaders,
  ): Promise<R> {
    const options: AxiosRequestConfig = {
      url: this.getUri(routePath),
      method: "get",
      params: paramsHeader?.params,
      headers: {
        "Content-Type": "application/json",
        ...paramsHeader?.headers,
      },
    };
<<<<<<< HEAD
    console.log(options);
    const response = axios<T, R>(options);
=======

    console.log(options);

    const response = await axios<T, R>(options);
>>>>>>> master

    return response;
  }

  public async post<T, B, R = AxiosResponse<T>>(
    routePath: string,
    data: B,
    paramsHeader?: ControllerParamsHeaders,
  ): Promise<R> {
    const options: AxiosRequestConfig = {
      url: this.getUri(routePath),
      method: "post",
      data,
      params: paramsHeader?.params,
      headers: {
        "Content-Type": "application/json",
        ...paramsHeader?.headers,
      },
    };

    console.log(options);
    const response = await axios<T, R>(options);

    return response;
  }

  public async put<T, B, R = AxiosResponse<T>>(
    routePath: string,
    data: B,
    headers?: any,
  ): Promise<R> {
    const options: AxiosRequestConfig = {
      url: this.getUri(routePath),
      method: "put",
      data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    const response = await axios<T, R>(options);

    return response;
  }

  public async delete<T, R = AxiosResponse<T>>(
    routePath: string,
    headers?: any,
  ): Promise<R> {
    const options: AxiosRequestConfig = {
      url: this.getUri(routePath),
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    const response = await axios<T, R>(options);

    return response;
  }
}

export default GenericController;
