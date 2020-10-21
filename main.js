let userInput = document.querySelector("#userInput");
let runBtn = document.querySelector("#runCode");
let stepBtn = document.querySelector("#stepCode");
let clearBtn = document.querySelector("#clearCode");
let outputDiv = document.querySelector(".outputDiv");
let count = 0;
let finalObj = {};


function createUserInputArr() {
  let userInputArr = (userInput.value).split("\n");
  let trimmedUserInputArr = userInputArr.map(el => el.trim())
  return trimmedUserInputArr;
}


function errorOpImpossible(i, obj) {
  console.error(`Line ${i + 1} - This operation is impossible`);
  obj.error = `Line ${i + 1} - This operation is impossible`;
  console.log(obj);
  return obj;

}

function errorDoesntExist(i, obj) {
  console.error(`Line ${i + 1} - This function doesn't exist`);
  obj.error = `Line ${i + 1} - This function doesn't exist`;
  console.log(obj);
  return obj;
}

function errorInfiniteLoop(i, obj) {
  console.error(`Line ${i + 1} - created infinite loop`);
  obj.error = `Line ${i + 1} - created infinite loop`;
  return obj;
}

function interpret(arr, obj = {}) {
  let lettersObject = obj
  console.log(lettersObject)
  let valueAtJump = 0; // used for infinite increasing loops in jnz
  let valueAtCmp = 0; //used for infinite loops when using cmp
  let label = "";
  let labelIndex = -1;
  let cmpX = 0;
  let cmpY = 0;

  for (let i = 0; i < arr.length; i++) {
    let temp = arr[i].split(" ");

    if (temp[0] === "mov") {
      if (isNaN(temp[2])) {
        if (lettersObject[temp[2]] == undefined) {
          errorOpImpossible(i, lettersObject);
        } else {
          lettersObject[temp[1]] = lettersObject[temp[2]];
        }
      } else {
        lettersObject[temp[1]] = Number(temp[2]);
      }
    } else if (temp[0] === "inc") {
      if (lettersObject[temp[1]] === undefined) {
        errorOpImpossible(i, lettersObject);
      } else {
        lettersObject[temp[1]] += 1;
      }
    } else if (temp[0] === "dec") {
      if (lettersObject[temp[1]] === undefined) {
        errorOpImpossible(i, lettersObject);
      } else {
        lettersObject[temp[1]] -= 1;
      }
    } else if (temp[0] === "jnz") {
      if (isNaN(temp[1])) {
        if (lettersObject[temp[1]] === undefined) {
          errorOpImpossible(i, lettersObject);
          return lettersObject;
        }
      }

      if (lettersObject[temp[1]] !== 0) {
        if (valueAtJump) {
          //first pass this will be 0 and won't run, second time it will run and if the loop continuously adds then it's an infinite loop and this will break it.
          if (lettersObject[temp[1]] >= valueAtJump) {
            errorInfiniteLoop(i, lettersObject);
            return lettersObject;
          }
        }

        valueAtJump = lettersObject[temp[1]];
        i += temp[2] - 1;
        if (i <= -2) {
          //-2 to adjust for the i++ which happens at the end of this if statement
          errorOpImpossible(i, lettersObject);
          return lettersObject;
        }
        if (lettersObject[temp[1]] < 0) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }
    } else if (temp[0] === "add") {
      if (lettersObject[temp[1]] === undefined) {
        errorOpImpossible(i, lettersObject);
        return lettersObject;
      }
      if (isNaN(temp[2])) {
        if (lettersObject[temp[2]] == undefined) {
          errorOpImpossible(i, lettersObject);
        } else {
          lettersObject[temp[1]] += lettersObject[temp[2]];
        }
      } else {
        lettersObject[temp[1]] += Number(temp[2]);
      }
    } else if (temp[0] === "sub") {
      if (lettersObject[temp[1]] === undefined) {
        errorOpImpossible(i, lettersObject);
        return lettersObject;
      }
      if (isNaN(temp[2])) {
        if (lettersObject[temp[2]] == undefined) {
          errorOpImpossible(i, lettersObject);
        } else {
          lettersObject[temp[1]] -= lettersObject[temp[2]];
        }
      } else {
        lettersObject[temp[1]] -= Number(temp[2]);
      }
    } else if (temp[0] === "mul") {
      if (lettersObject[temp[1]] === undefined) {
        errorOpImpossible(i, lettersObject);
        return lettersObject;
      }
      if (isNaN(temp[2])) {
        if (lettersObject[temp[2]] == undefined) {
          errorOpImpossible(i, lettersObject);
        } else {
          lettersObject[temp[1]] *= lettersObject[temp[2]];
        }
      } else {
        lettersObject[temp[1]] *= Number(temp[2]);
      }
    } else if (temp[0] === "div") {
      if (lettersObject[temp[1]] === undefined) {
        errorOpImpossible(i, lettersObject);
        return lettersObject;
      }
      if (isNaN(temp[2])) {
        if (lettersObject[temp[2]] == undefined) {
          errorOpImpossible(i, lettersObject);
        } else {
          lettersObject[temp[1]] /= lettersObject[temp[2]];
        }
      } else {
        lettersObject[temp[1]] /= Number(temp[2]);
      }
    } 
    else if (temp[0].includes(":")){
      label = temp[0].replace(":", "");
      labelIndex = i;
      } 
    else if (temp[0] === "cmp") {
      if (isNaN(temp[1])) {
        cmpX = lettersObject[temp[1]];
      } else {
        cmpX = Number(temp[1]);
      }
      
      if (isNaN(temp[2])) {
        cmpY = lettersObject[temp[1]];
      } else {
        cmpY = Number(temp[2]);
      } console.log(cmpX, cmpY);
    }
    else if (temp[0] === "jne" && temp[1] === label) {
      if (valueAtCmp) {
        if (cmpX > cmpY && valueAtCmp <= cmpX || cmpX < cmpY && valueAtCmp > cmpX) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }

      if (cmpX !== cmpY) {
        valueAtCmp = cmpX;
        i = labelIndex;
      }
    }
    else if (temp[0] === "je" && temp[1] === label) {
      if (valueAtCmp) {
        if (cmpX === cmpY && valueAtCmp === cmpX) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }
      if (cmpX === cmpY) {
        valueAtCmp = cmpX;
        i = labelIndex;
      }
    }
    else if (temp[0] === "jge" && temp[1] === label) {
      if (valueAtCmp) {
        if (cmpX >= cmpY && valueAtCmp <= cmpX) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }
      if (cmpX >= cmpY) {
        valueAtCmp = cmpX;
        i = labelIndex;
      }
    }
    else if (temp[0] === "jg" && temp[1] === label) {
      if (valueAtCmp) {
        if (cmpX > cmpY && valueAtCmp < cmpX) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }
      if (cmpX > cmpY) {
        valueAtCmp = cmpX;
        i = labelIndex;
      }
    }
    else if (temp[0] === "jle" && temp[1] === label) {
      if (valueAtCmp) {
        if (cmpX <= cmpY && valueAtCmp >= cmpX) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }
      if (cmpX <= cmpY) {
        valueAtCmp = cmpX;
        i = labelIndex;
      }
    }
    else if (temp[0] === "jl" && temp[1] === label) {
      if (valueAtCmp) {
        if (cmpX < cmpY && valueAtCmp > cmpX) {
          errorInfiniteLoop(i, lettersObject);
          return lettersObject;
        }
      }
      if (cmpX < cmpY) {
        valueAtCmp = cmpX;
        i = labelIndex;
      }
    }
    else if (temp[0] === "jmp" && temp[1] === label) {
      valueAtCmp = cmpX;
      i = labelIndex;
      
    }
    
    else {
      errorDoesntExist(i, lettersObject);
      return lettersObject;
    }
  }

  console.log(lettersObject);
  return lettersObject;
}

function renderObj(object) {
  outputDiv.innerHTML = "";
const ul = document.createElement("ul");
outputDiv.append(ul);
for (let element in object) {
  const li = document.createElement("li");
  li.innerText = `${element}: ${object[element]}`;
  if (element === "error") {
    li.classList.add("error");
  }
  ul.append(li);
}
}

// interpret(["mov a 1"]); // => {a: 1}
// interpret(["mov a 2", "inc a"]); // => {a: 3}
// interpret(["mov a 1", "mov b a", "dec b"]); // => {a:1, b:0}
// interpret(["mov a 5", "inc a", "dec a", "dec a", "jnz a -1", "inc a"]); // => {a: 1}
// interpret(["mov a 5", "mov b a", "dec b", "dec b"]); // => {a: 5, b: 3}
// interpret(["mov a 1", "jnz 5 2", "mov b 3", "inc a"]); // => {a: 2}
// interpret(["mov a 2", "add a 10"]); // => {a:12}
// interpret(["mov a 2", "mov b 3", "add a b"]); // => {a:5, b:3}
// interpret(["mov a 20", "sub a 5"]); // => {a:15}
// interpret(["mov a 7", "mov b 2", "sub a b"]); // => {a:5, b:2}
// interpret(["mov a 20", "mul a 5"]); // => {a:100}
// interpret(["mov a 10", "mov b 5", "mul a b"]); // => {a:30, b:5}
// interpret(["mov a 20", "div a 5"]); // => {a:4}
// interpret(["mov a 6", "mov b 3", "div a b"]); // => {a:2, b:3}
// interpret(["mov a 3", "sub a 2", "jnz a -1"]); // infinite subtracting loop
// interpret(["mov a 3", "inc a", "jnz a -2"]); //Infinite adding loop
// interpret(["mov a 3", "add a 2", "jnz a -1"]); //Infinite adding loop
// interpret(["mov a 3", "mul a 3", "jnz a -3"]); //Infinite mul loop
// interpret(["mov a 3", "div a 3", "jnz a -1"]); //Infinite div loop
//interpret(["mov a 10", "start:", "dec a"])
//interpret(["mov a 10", "start:", "dec a", "cmp a 0", "je start"])
//interpret(["mov a 10", "start:", "inc a", "cmp a 20", "jl start"])

function runHandler() {
  const finalUserInput = createUserInputArr()
  console.log(finalUserInput);
  const finalObj = interpret(finalUserInput)
  renderObj(finalObj)
}

function stepHandler(count) {
  const finalUserInput = createUserInputArr();
  
  console.log(userInput.value);
  if (count >= finalUserInput.length) {
    return;
  } else {
    finalObj.Line = `${count + 1} - ${finalUserInput[count]}`
    finalObj = interpret([finalUserInput[count]], finalObj)
    renderObj(finalObj);
    
  }
  
}

runBtn.addEventListener("click", runHandler);
stepBtn.addEventListener("click", () => {
  stepHandler(count);
  count++;
  });
  
clearBtn.addEventListener("click", () => {
  userInput.value = "";
  outputDiv.innerHTML = "";
})