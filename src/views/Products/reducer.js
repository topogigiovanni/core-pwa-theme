import { combineReducers } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS } from './actions';

// export const productPropType = PropTypes.shape({
//   id: PropTypes.number.isRequired,
//   name: PropTypes.string.isRequired,
//   price: PropTypes.string.isRequired,
//   permalink: PropTypes.string.isRequired,
//   images: PropTypes.arrayOf(
//     PropTypes.shape({
//       src: PropTypes.string.isRequired,
//     }),
//   ),
//   categories: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//     }),
//   ).isRequired,
//   average_rating: PropTypes.string.isRequired,
//   rating_count: PropTypes.number.isRequired,
//   variations: PropTypes.arrayOf(PropTypes.number).isRequired,
// });

export const productPropType = PropTypes.shape({
  ProductID: PropTypes.number.isRequired,
  Name: PropTypes.string.isRequired,
  RetailPrice: PropTypes.number,
  ListPrice: PropTypes.number,
  Tax: PropTypes.number,
  TaxationAmount: PropTypes.number,
  Options:  PropTypes.array,
  Availability: PropTypes.string.isRequired,
  MediaSmall: PropTypes.string,
  Items: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Availability: PropTypes.string.isRequired,
      ExtendedMetadatas: PropTypes.array,
      RetailPrice: PropTypes.number,
      ListPrice: PropTypes.number,
      Tax:  PropTypes.number,
      ProductID: PropTypes.number.isRequired,
      IsInventoryAvailable: PropTypes.boolean,
      IsPurchasable: PropTypes.boolean,
      StockBalance: PropTypes.number,
      MaximumQtyAllowed: PropTypes.number,
      MinimumQtyAllowed: PropTypes.number
    })
  )
});
const items = (state = [], action) => {
  switch (action.type) {
    case REQUEST_PRODUCTS:
      return state;
    case RECEIVE_PRODUCTS:
      // debugger;
      const products = _.get(action, 'products.base.Products', []);
      //return _.unionBy([products], state, 'id');
      return [
        ...state,
        ...products
      ];
    default:
      return state;
  }
};

const hasMore = (state = false, action) => {
  switch (action.type) {
    case REQUEST_PRODUCTS:
      return true;
    case RECEIVE_PRODUCTS:
      // 20 is the default per_page number used for paginating products
      return _.get(action, 'products.base.HasNextPage', false);
    default:
      return state;
  }
};

const isFetching = (state = 0, action) => {
  switch (action.type) {
    case REQUEST_PRODUCTS:
      return state + 1;
    case RECEIVE_PRODUCTS:
      return state - 1;
    default:
      return state;
  }
};

// export const getProducts = (state, category = null) => {
//   if (category === null) {
//     return state.items;
//   }

//   return state.items.filter(product =>
//     Array.isArray(product.categories) &&
//     !_.isNil(_.find(product.categories, { id: Number(category) })));
// };

export const getProducts = (state, category = null) => {
  if (category === null) {
    return state.items;
  }

  return state.items;
};

export const getProductsFetching = state => state.isFetching;
export const getProductsHasMore = state => state.hasMore;

export default combineReducers({
  items,
  isFetching,
  hasMore,
});
