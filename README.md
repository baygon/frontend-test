## 0. Before you begin

You have 48 hours to solve this assesment

You can work with any technology you want, but solutions in React
are prefered. If you decide to work with anything else other than React or Vanilla JS feel free to remove the whole project and start fresh, but make sure to add instructions on how to run your solution.

We have prepared a simple HTTP server for you to begin with, in order to get it to work run the following commands in the root of this project

````
npm install
npm run start
````

You should then be able to access your code on http://127.0.0.1:8080. You should see the index.html with `HTTPOOL Frontend Test` content.

If you decide to implement your solution, or part of it in React we have created a clean React app, you can find it in `react-app` directory. The app was created with create-react-app (https://create-react-app.dev/), to run it move into its directory and run `npm run start` inside it. The app should open in a new dev server at http://localhost:3000/

First make sure the application works, if you have any time left after that you may add styles or other stuff to further improve it, but the main objective is to **complete every task below**.

Don't hesitate to come to us with any questions.

## 1. Warmup

Feel free to just create a JavaScript file to solve this task, no need to implement it with React

1. Add a button to a HTML5 page
2. When the button is pressed print numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".
3. Each number/fizz should be in a new line

## 2. Working with the API

Solutions in React are prefered here, but not mandatory. You can also implement them in Vanilla JS.

You will find the documentation for the API you will need to use in this task at https://openlibrary.org/developers/api.

### 1. Display full info
https://openlibrary.org/api/books?bibkeys=ISBN:9783442236862&jscmd=details&format=json
Display info for one book

Cover image | Title | authors | publish_date | physical_format

- Cover image should be large (-L)

### 2. Search API
http://openlibrary.org/search.json?title=snow+crash
- Input box for searching
- List all the covers with titles for the books
- Cover image should be large, but put a circle mask over it.

### 3. Display additional info when hovering the book
- When hovering over the book display full info about the book in the overlay (big image, title, authors, publish date, physical format, number_of_pages, weight)
- Notes:
  - Books can have multiple ISBNs, just take the first for the call
  
 ### 4. Add unit tests for components
 - Add unit tests for components that you have implemented
 - Make sure test coverage is at least 75%
