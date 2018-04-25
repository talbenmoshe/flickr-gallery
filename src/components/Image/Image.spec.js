// import 'jsdom-global/register';
import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';
import Image from './Image.js';

describe('Image', () => {

  const sampleImage = {id: '28420720169', owner: '59717246@N05', secret: 'd460443ecb', server: '4722', farm: 5};

  let wrapper;
  const imageSize = 200;

  beforeEach(() => {
    wrapper = mount(
      <Image dto={sampleImage} size={imageSize}/>,
      {attachTo: document.createElement('div')}
    );
  });

  it('render 3 icons on each image', () => {
    expect(wrapper.find('FontAwesome').length).to.equal(3);
  });
});
