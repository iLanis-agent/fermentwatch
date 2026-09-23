# FermentWatch

Sourdough timing that knows your kitchen.

Recipes assume a 24C kitchen; yeast does not care about your recipe. FermentWatch rebuilds the whole bake-day schedule - feed, bulk ferment, shape, proof, bake - around your actual room temperature (rate roughly doubles per +10C), giving real clock times for every stage plus what to look for and what comes next.

## Use it

Open `index.html` for the landing page, or go straight to `app.html`.

Everything runs client-side; the running bake is stored in the browser's localStorage. No account, no server.

## Files

- `index.html` - landing page
- `app.html` - the app
- `engine.js` - pure fermentation schedule math, shared by the app and tests

Built by the hourly app factory.
