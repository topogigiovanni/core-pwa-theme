import 'whatwg-fetch';
import config from '../../config/config';

export const REQUEST_PRODUCTS = 'REQUEST_PRODUCTS';
export const REQUEST_PRODUCT = 'REQUEST_PRODUCT';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';

export const requestProducts = () => ({
  type: REQUEST_PRODUCTS,
});

export const requestProduct = () => ({
  type: REQUEST_PRODUCT,
});

export const receiveProducts = products => ({
  type: RECEIVE_PRODUCTS,
  products,
});

export const receiveProduct = product => ({
  type: RECEIVE_PRODUCT,
  product,
});

// @deprecated
export const fetchProducts = (params = {}) => (dispatch) => {
  dispatch(requestProducts());

  let url;
  if (params && params.id) {
    url = config.API_PRODUCT_URL + String(params.id);
  } else {
    url =
      config.API_PRODUCTS_URL +
      '?' +
      Object.keys(params)
        .map(k => k + '=' + encodeURIComponent(params[k]))
        .join('&');
  }

  return fetch(url)
    .then(response => response.json())
    .then(json => dispatch(receiveProducts(json)))
    .catch(() => {
      dispatch(receiveProducts([]));
    });
};

export const getProduct = (id) => (dispatch) => {
  dispatch(requestProduct());

  let url = `/produto-p${id}`;

  // if (id) {
  //   url = config.API_PRODUCT_URL + String(id);
  // } else {
  //   url =
  //     config.API_PRODUCTS_URL +
  //     '?' +
  //     Object.keys(params)
  //       .map(k => k + '=' + encodeURIComponent(params[k]))
  //       .join('&');
  // }

  return fetch(url)
    .then(response => response.json())
    .then(json => dispatch(receiveProduct(json)))
    .catch(() => {
      dispatch(receiveProducts());
    });
};


export const fetchProductList = (params = {}) => (dispatch) => {
  dispatch(requestProducts());

  let url = '/listas/';

  if(params.listAlias) {
    url += params.listAlias;
  }

  if(params.paginator){
    url =
      url +
      '?' +
      Object.keys(params)
        .map(k => k + '=' + encodeURIComponent(params[k]))
        .join('&');
  }

  return fetch(url)
    .then(response => response.json())
    .then(json => dispatch(receiveProducts(json)))
    .catch(() => {
      dispatch(receiveProducts([]));
    });
};
