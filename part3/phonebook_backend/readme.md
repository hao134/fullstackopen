# Part3 Backend Note

* 後端連接各endpoint的情形(列出前端有使用的）：
```javascript
app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(people => {
    response.json(people)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: 'need name or number'
    })
  }

  const person = new Phonebook({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch((error) => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Phonebook.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

```

* 使用 morgan 來定義回覆的形式：
```javascript=
morgan.token('data', (request, response) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ' '
})

const morganrequest = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.data(req, res)
  ].join(' ')
})
```
下面這張截圖是它回應的樣子：
![](https://i.imgur.com/t8Mm9k4.png)

* Phonebook是mongoose定義的schema，且設有validation:
```javascript
const numberValidators = [
  {
    // Minimum length validator
    validator: (number) => {
      if ((number[2] === '-' || number[3] === '-') && number.length < 9) {
        return false;
      }
      return true;
    },
    msg: "must be at least 8 digits",
  },
  {
    // Regex validator to allow only numbers
    validator: (number) => {
      return /^\d{2,3}-\d+$/.test(number);
    },
    msg: "invalid phone number",
  },
];

const phonebookSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      validate: numberValidators,
      required: true
    },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
```
由上可得知名字至少要三個字且電話號碼僅能接受第三碼或第四碼的字串包含"-"且長度不小於9的字串，以下是當發生錯誤時，前端接到錯誤時的處理
![](https://i.imgur.com/0WYbVXe.png)
<hr/>

![](https://i.imgur.com/9nyoNON.png)
