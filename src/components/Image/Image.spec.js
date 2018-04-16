// import 'jsdom-global/register';
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import FontAwesome from 'react-fontawesome';
import Image from './Image.js';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const galleryWidth = 1111;

  const mountImage = () => {
    return wrapper = mount(<Image dto={sampleImage} galleryWidth={galleryWidth}/>);
  };

  beforeEach(() => {
    wrapper = mountImage();
  });

  it('renders', () => {
    expect(wrapper).to.not.be.undefined;
  });

  it('render 3 icons on each image', () => {
    expect(wrapper.find(FontAwesome).length).to.equal(3);
  });

  it('render image controls', () => {
    expect(wrapper.find('.image-controls').length).to.equal(1);
  });

  it('calc image size on mount', () => {
    const spy = sinon.spy(Image.prototype, 'calcImageSize');
    wrapper = mountImage();
    expect(spy.calledOnce).to.equal(true)
  });

  it('calculate image size correctly', (done) => {
    const imageSize = wrapper.state().size;
    const imagesPerRow = Math.round(galleryWidth / imageSize);
    const newSize = Math.floor(galleryWidth / imagesPerRow);

    wrapper.setState({
      size: newSize
    }, () => {
      expect(wrapper.state().size).to.equal(newSize);
      done();
    });
  });

});
