import React from 'react';
import {shallow} from 'enzyme';
import {expect} from 'chai';
import ShareImage from './ShareImage.js';

describe('ShareImage', () => {

  const imageUrl = 'https://farm1.staticflickr.com/878/41398916355_fbd5bf1b7b.jpg';
  let wrapper;
  const mountShareImage = () => {
    return shallow(
      <ShareImage url={imageUrl} iconSize={32}/>,
      {lifecycleExperimental: true, attachTo: document.createElement('div')}
    );
  };

  beforeEach(() => {
    wrapper = mountShareImage();
  });

  it('renders', () => {
    expect(wrapper).to.not.be.undefined;
  });
  //as for now only 3 buttons implemented and always added to view.
  it('make sure all the share buttons well rendered', done => {
      expect(wrapper.children().length).to.eq(3);
      done();
  });

});
