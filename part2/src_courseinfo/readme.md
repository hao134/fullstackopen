# 首頁如此：
![](https://i.imgur.com/7Mcm5gt.png)
* course 的資料長這樣：
```javascript
const courses = [
        {
            name: 'Half Stack application development',
            id: 1,
            parts: [
                {
                    name: 'Fundamentals of React',
                    exercises: 10,
                    id: 1
                },
                {
                    name: 'Using props to pass data',
                    exercises: 7,
                    id: 2
                },
                {
                    name: 'State of a component',
                    exercises: 14,
                    id: 3
                },
                {
                    name: 'Redux',
                    exercises: 11,
                    id: 4
                }
            ]
        },
        {
            name: 'Node.js',
            id: 2,
            parts: [
                {
                    name: 'Routing',
                    exercises: 3,
                    id: 1
                },
                {
                    name: 'Middlewares',
                    exercises: 7,
                    id: 2
                }
            ]
        }
    ]
```

* 在App.js中的組成是這樣：
```javascript
return (
  <div>
    {courses.map((course) => (
      <Course key={course.id} course={course} />
    ))}
  </div>
)
```
* 在 Course.js
```javascript
const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}
```

* Header和Content只是單存的把資料列出來，而Total則是用了一個比較有趣的技巧（reduce)
```javascript
const Total = ({ parts }) => {
    const total = parts.reduce((sum, parts) => {
        return sum + parts.exercises;
    }, 0);

    return (
        <strong>
            total of {total} exercises
        </strong>
    )
}
```

### reduce sum:
```javascript
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);

console.log(sum); // 15
```
* 說明

在上面的代碼中，我們首先定義一個名為numbers的數組。然後，我們使用reduce()方法，對數組中的元素進行求和操作。在reduce()方法中，我們傳遞一個回調函數作為第一個參數。該回調函數接受兩個參數：accumulator和currentValue。 accumulator是我們在每次迭代中保留的累加值，而currentValue則是當前迭代的數組元素。在回調函數中，我們將accumulator和currentValue相加，並將其作為下一個迭代的accumulator值返回。我們還傳遞了一個初始值為0的accumulator。

在最後一行代碼中，我們輸出了sum變量的值，它包含了我們對數組中所有元素求和的結果。