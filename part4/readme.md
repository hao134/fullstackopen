## Running tests one by one

* The following command only runs the tests found in the tests/note_api.test.js file:
```
npm test -- tests/note_api.test.js
```

* The -t option can be used for running tests with a specific name:
```
npm test -- -t "a specific note is within the returned notes"
```

* The following command will run all of the tests that contain notes in their name:
```
npm test -- -t 'notes'
```
