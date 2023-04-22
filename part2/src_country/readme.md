## 首頁如此：
<hr/>

![](https://i.imgur.com/CK0VEJO.png)

### 輸入國家名會給出一些選項：
<hr/>

![](https://i.imgur.com/Jw940RO.png)

### 按下Germany旁邊的show按鈕後：
<hr/>

![](https://i.imgur.com/3qjqbo2.png)

* 首頁的組成是這樣：
```jsx
return (
  <div>
    <div>
      Find countries <input value={query} onChange={queryByName} />
    </div>
    {countrytoshow.length === 1 ? (
      <CountryData country={countrytoshow[0]} />
    ) : null}
    {countrytoshow.length > 10 ? (
      <div>Too many matches, specify another filter</div>
    ) : (
      <Countries
        countriesToShow={countrytoshow}
        setCountriesToShow={setCountrytoshow}
      />
    )}
  </div>
)
```
* 因為一開始抓取資料是抓取全部的國家，因此一開始的顯示文字是"Too many matches, specify another filter"
```jsx
useEffect(() => {
  console.log('effect')
  axios
    .get('https://restcountries.com/v3.1/all')
    .then(response => {
      console.log('promise fulfilled')
      setCountries(response.data)
    })
}, [])
```

### 而當輸入的國家名明確，則明確顯示一個國家
<hr/>

![](https://i.imgur.com/6S5FElg.png)

* 當按下show的時候，由於setCountriesToShow([country])，會顯示單個國家：
```jsx
const Countries = ({ countriesToShow, setCountriesToShow }) =>{
    if (countriesToShow.length === 1) return null;

    return countriesToShow.map((country)=>(
        <div key={country.name.official}>
            {country.name.common}{" "}
            <button onClick={()=>setCountriesToShow([country])}>show</button>
        </div>
    ))
}
```