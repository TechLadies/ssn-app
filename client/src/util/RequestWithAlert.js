import { AlertType, NETWORK_ERROR_MESSAGE } from 'components/Alert';

export class RequestWithAlert {
  constructor(showAlert) {
    this.showAlert = showAlert;
  }

  onNetworkError = (handler) => {
    this.networkErrorHandler = handler;
    return this;
  }

  constructHeaders = (token) => {
     const headers = { 'Content-Type': 'application/json' };
     if (token) {
       headers['Authorization'] = `Bearer ${token}`;
     }

     return headers;
  }

  get = async (url, token) => {
    return this.execute(
      url,
      {
        headers: this.constructHeaders(token),
      },
    );
  }

  put = async (url, body, token) => {
    return this.execute(
      url,
      {
        method: 'put',
        headers: this.constructHeaders(token),
        body: JSON.stringify(body),
      },
    );
  }

  post = async (url, body, token) => {
    return this.execute(
      url,
      {
        method: 'post',
        headers: this.constructHeaders(token),
        body: JSON.stringify(body),
      },
    );
  }

  delete = async (url, token) => {
    return this.execute(
      url,
      {
        method: 'delete',
        headers: this.constructHeaders(token),
      },
    );
  }

  execute = async (url, options) => {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        response.isSuccessful = true;
      } else {
        response.hasError = true;
      }

      return response;
    } catch(err) {
      if (this.networkErrorHandler) {
        this.networkErrorHandler();
      }

      this.showAlert(
        'networkError',
        AlertType.ERROR,
        NETWORK_ERROR_MESSAGE,
      );
      return {};
    }
  }
}
