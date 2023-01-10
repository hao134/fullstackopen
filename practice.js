/////////////////////////// Variables ////////////////////////
// const x = 1
// let y = 5

// console.log(x, y)   // 1, 5 are printed
// y += 10
// console.log(x, y)   // 1, 15 are printed
// y = 'sometext'
// console.log(x, y)   // 1, sometext are printed
// x = 4               // causes an error

//////////////////////// Arrays /////////////////////////////

// const t = [1, -1, 3]

// t.push(5)

// console.log(t.length) // 4 is printed
// console.log(t[1])     // -1 is printed

// t.forEach(value => {
//   console.log(value)  // numbers 1, -1, 3, 5 are printed, each to own line
// })

// note: 數組的內容可以被修改，儘管它被定義為const。因為數組是一個對象，這個變量總是指向同一個對象。然而, 數組的內容隨著新項目的加入而改變.
//-------------------------------------------------
// const t = [1, -1, 3]

// const t2 = t.concat(5)

// console.log(t)  // [1, -1, 3] is printed
// console.log(t2) // [1, -1, 3, 5] is printed

//---------------------------------------------------
// const t = [1, 2, 3]

// const m1 = t.map(value => value * 2)
// console.log(m1)   // [2, 4, 6] is printed

// const m2 = t.map(value => '<li>' + value + '</li>')
// console.log(m2)
// // [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
//--------------------------------------------------

// const t = [1, 2, 3, 4, 5]

// const [first, second, ...rest] = t

// console.log(first, second)  // 1, 2 is printed
// console.log(rest)          // [3, 4, 5] is printed

////////////////////////////// Objects /////////////////////

// const object1 = {
//     name: 'Arto Hellas',
//     age: 35,
//     education: 'PhD',
//   }
  
//   const object2 = {
//     name: 'Full Stack web application development',
//     level: 'intermediate studies',
//     size: 5,
//   }
  
//   const object3 = {
//     name: {
//       first: 'Dan',
//       last: 'Abramov',
//     },
//     grades: [2, 3, 5, 3],
//     department: 'Stanford University',
//   }

// console.log(object1.name)         // Arto Hellas is printed
// const fieldName = 'age'
// console.log(object1[fieldName])    // 35 is printed

// object1.address = 'Helsinki'
// object1['secret number'] = 12341

////////////////////////////// Functions /////////////////////

// const sum = (p1, p2) => {
//   console.log(p1)
//   console.log(p2)
//   return p1 + p2
// }

// const result = sum(1, 5)
// console.log(result)

// const square = p => {
//   console.log(p)
//   return p*p
// }

// const square2 = p => p * p

// const t = [1, 2, 3]
// const tsquared  = t.map(p => p * p)
// console.log(tsquared)

//////////////////// Object methods and "this" ////////////////////
// const arto = {
//   name: 'Arto Hellas',
//   age: 35,
//   education: 'PhD',
//   greet: function() {
//     console.log('hello, my name is ' + this.name)
//   },
//   doAddition: function(a,b){
//     console.log(a + b)
//   },
// }

// arto.greet()  // "hello, my name is Arto Hellas" gets printed
// //-------
// arto.growOlder =  function() {
//   this.age += 1
// }
// //--------
// console.log(arto.age)
// arto.growOlder()
// console.log(arto.age)
// // -----------
// arto.doAddition(1, 5)
// const referenceToAddition = arto.doAddition
// referenceToAddition(10, 15)

// // -----------
// arto.greet()       // "hello, my name is Arto Hellas" gets printed

// const referenceToGreet = arto.greet
// referenceToGreet() // prints "hello, my name is undefined"

// const arto = {
//   name: 'Arto Hellas',
//   greet: function() {
//     console.log('hello, my name is ' + this.name)
//   },
// }

// setTimeout(arto.greet, 1000)

// setTimeout(arto.greet.bind(arto), 1000)

//////////////////// Classes ////////////////////
class Person{
  constructor(name, age){
    this.name = name
    this.age = age
  }
  greet(){
    console.log('hello, my name is '+ this.name)
  }
}

const adam = new Person('Adam Ondra', 35)
adam.greet()

const janja = new Person('Janja Garnbret', 22)
janja.greet()