// import 'jsdom-global/register';
import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import Image from './Image.js';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const galleryWidth = 1000;
  const imageSize = 200;

  const mountImage = () => {
    return shallow(
      <Image dto={sampleImage} galleryWidth={galleryWidth} imageSize={imageSize}/>,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mountImage();
  });

  it('render 3 icons on each image', () => {
    expect(wrapper.find('FontAwesome').length).to.equal(3);
  });

  it('calculate image size correctly', () => {
    const imageSize = wrapper.state().imageSize;
    const remainder = galleryWidth % imageSize;
    expect(remainder).to.be.lessThan(1);
  });

});
