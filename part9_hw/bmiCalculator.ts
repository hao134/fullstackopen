const calculateBmi = (height: number, weight: number): string => {
    const bmi = weight / (height/100)**2
    if (bmi < 18.5){
      return "underweight"
    }
    if (bmi <= 24.9){
      return "Normal (healthy weight)"
    }
    if (bmi <= 29.9){
      return "Overweight"
    }
    return "Obese"
  }
console.log(calculateBmi(180,74))