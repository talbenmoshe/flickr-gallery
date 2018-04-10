# Flickr Gallery

Welcome to the Flickr Gallery application.
This app is simple, you write a tag at the top and you get images from flickr with that tag.

[![Build Status](https://travis-ci.org/talbenmoshe/flickr-gallery.svg?branch=master)](https://travis-ci.org/talbenmoshe/flickr-gallery)


## Getting Started
To get this app running locally all you need to do is:
1. Fork this repo into your personal github account.
1. Clone the forked repo into your computer `git clone git@github.com:[YOUR_USERNAME]/flickr-gallery.git`
2. In the created folder install the node modules `npm install`
3. Run the app `npm start`
4. Your local app should be available at `http://localhost:8000`

## Your Tasks
Please complete the following tasks. You may consult with Google and friends, **but you are responsioble for your own code** - you should be able to explain each and every line of code you add.
### Notes
- All the code changes should be under the `/src/components` folder.
- You can see a short demo video of the app [here](https://youtu.be/NW4VojSUFQc) (Not all features are shown)
- If needed, you may add other *npm* packages.


### Task 1 - Getting Flickr images for the gallery
- Implement the `getImages` method in the `Gallery.js` file. Use the input from the top search bar to get images from Flickr using the [Flickr Api](https://www.flickr.com/services/api/flickr.photos.search.html). The search should support multiple tags separated by a comma (e.g. "art,cat,dog" - should return results containg all 3 tags).
- The browser should remember my last search.


### Task 2 - Image Actions
Each image has three buttons that appear on mouse hover. You need to make them work.
1. Delete: clicking the delete button should remove the image from the display.
2. Rotate: each click should rotate the image by 90 degrees.
3. Expand: clicking an image should display this image in a larger view.

### Task 3 - Gallery Actions
1. Responsive:  the gallery adjusts the size of each image so that all the images will fit into the screen without margin. However, when the window is resized, the images are not fitted so well. Make sure the images are always adjusted to the window width.
2. Infinite Scroll: currently the gallery displays only 100 images. Create a mechanism that loads more images from flickr when the user is scrolling past the last image.
3. Drag & Drop: let your users choose the order of the images by adding an option to drag & drop images to their new position.
4. Implement virtual gallery. This means that an item should not render the image if it is not visible on the screen.

### Task 4 - Add a custom feature
- This is your chance to get creative. Add a new, **cool and innovative** feature to the gallery. **Note:** All preceding tasks should still work.

### Bonus task
- If possible, write tests for every new feature you write (tests are written in spec.js files)

## Deploying Your Project
After you've completed your tasks, and you are ready to submit it, do the following:
1. Make sure your code is on the `master` branch and that it is pushed into your repo.
2. Run the deploy script `npm run deploy`
3. You project should be live on `https://[YOUR_USERNAME].github.io/flickr-gallery/`
4. Create a Pull Request of your changes (Pull Requests > New Pull Request > Create Pull Request)
5. Send us an email with your repo link and the deployed app link
6. Profit

## Good Luck!
