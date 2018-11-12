import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Header, Card, Icon, Button } from 'semantic-ui-react';
import ImageGallery from 'react-image-gallery';
import { productPropType } from '../Products/reducer';
import { addProduct } from '../Cart/actions';
import Rating from '../../components/Rating';
import Reviews from '../../components/Reviews';
import Variations from '../../components/Variations';
import SocialBox from './SocialBox';
import config from '../../config/config';

import './styles.css';

class ProductDetails extends Component {
  static isAnyCached(images) {
    return images
      .map((image) => {
        const newImage = new Image();
        newImage.src = image.original;
        return newImage.complete;
      })
      .filter(isCached => isCached === false);
  }

  constructor(props) {
    super(props);

    this.state = {
      selections: null,
      variationId: null,
    };

    this.receiveSelections = this.receiveSelections.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  getCategories() {
    const categories = _.get(this.props.product, 'ExtendedProps.categories', []);
    return categories.map(category => category).join(', ');
  }

  getImageGallery() {
    if(!this.props.product.Medias) {
      return [];
    }

    const medias = this.props.product.Medias.filter(media => media.MediaSizeType === 'Medium') || [];
    return medias.map(media => ({ original: media.MediaPath }));
  }

  /**
   * Modify component's state when a variation is selected.
   * @param {Object} selections
   * @param {Number} variationId
   */
  receiveSelections(selections, variationId) {
    console.log(selections, variationId);
    this.setState({ selections, variationId });
  }

  /**
   * Add product to cart.
   * Display a warning if the product has variations and attributes were not selected.
   */
  addItem() {
    const skuItems = this.getSkuItems();
    if (skuItems.length !== 0) {
      if (_.isNull(this.state.selections)) {
        toastr.warning('Please make a selection for all of the products actions');
        return;
      }
    }

    const { dispatch } = this.props;
    const product = this.props.product;

    const media = _.head(this.getImageGallery()) || {};

    // console.log('media', media);
    // debugger;

    dispatch(
      addProduct(
        product.ProductID,
        product.Name,
        product.RetailPrice,
        media.original,
        this.state.variationId,
        this.state.selections,
      ),
    );

    toastr.success('Added to Cart', product.Name + ' was added to your shopping cart.');
  }

  getSkuItems() {
    const skuItems = _.get(this.props.product, 'Items', []);

    return _.filter(skuItems, s =>  s.ProductID !== this.props.product.ProductID);
  }

  render() {
    const anyCached =
      ProductDetails.isAnyCached(this.getImageGallery())[0] === false
        ? ProductDetails.isAnyCached(this.getImageGallery())[0]
        : true;
    const extended = _.get(this.props.product, 'ExtendedProps', {});
    const categories = extended.categories || [];
    const permalink = extended.permalink || '';
    const variations = _.get(this.props.product, 'variations', []);
    // let skuItems = _.get(this.props.product, 'Items', []);
    const descriptions = _.get(this.props.product, 'Descriptions', []);

    // skuItems = _.filter(skuItems, s =>  s.ProductID !== this.props.product.ProductID);
    const skuItems = this.getSkuItems();

    return (
      <div>
        <Header textAlign="center" className="break-words">
          {this.props.product.Name}
        </Header>
        <Card centered>
          <ImageGallery
            items={this.getImageGallery()}
            slideDuration={550}
            showPlayButton={false}
            showThumbnails={false}
            showNav={window.navigator.onLine || anyCached}
            disableSwipe={!window.navigator.onLine || !anyCached}
          />
          {this.props.product.RatingCount > 0 ? (
            <Card.Content extra>
              <Rating
                rating={Math.round(Number(this.props.product.RatingAverage))}
                ratingCount={this.props.product.RatingCount}
              />
            </Card.Content>
          ) : null}
          {categories.length === 0 ? null : (
            <Card.Content>{this.getCategories()}</Card.Content>
          )}
          <Card.Content>{this.props.product.IsInventoryAvailable ? 'In Stock' : 'Out of Stock'}</Card.Content>
          {this.props.product.RetailPrice ?
            (<Card.Content>
              <div dangerouslySetInnerHTML={{ __html: config.CURRENCY + this.props.product.RetailPrice }} />
            </Card.Content>) : null}
          {skuItems.length === 0 ? null : (
            <Variations
              sendSelections={this.receiveSelections}
              productId={this.props.product.ProductID}
              variationIds={_.map(skuItems, s => s.ProductID)}
              variations={skuItems}
            />
          )}
          {this.props.product.IsPurchasable? (
            <Button color="purple" fluid onClick={this.addItem}>
              ADD TO CART &nbsp;<Icon name="cart" />
            </Button>
          ) : null}
        </Card>
        {descriptions.length === 0 ? null : (
          <Card centered>
            <Card.Content>
              <Card.Header as={Header} size="tiny">
                Description
              </Card.Header>
              <Card.Description>
                <div dangerouslySetInnerHTML={{ __html: descriptions[0].Value }} />
              </Card.Description>
            </Card.Content>
          </Card>
        )}
        <Reviews productId={this.props.product.ProductID} />
        <SocialBox permalink={permalink} />
      </div>
    );
  }
}

ProductDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,
  product: productPropType.isRequired,
};

function mapDispatchToProps(dispatch) {
  return Object.assign({ dispatch }, bindActionCreators({ addProduct }, dispatch));
}

export default connect(null, mapDispatchToProps)(ProductDetails);
