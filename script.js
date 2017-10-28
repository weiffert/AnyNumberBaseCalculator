var equation = [" "];
var focus = 0;
var clearAll = false;
var modalShow = false;

function appendChar(character) {
    if(clearAll) {
        clearEverything();
    }
    if((focus + 1) % 2 === 0) {
        equation.push("");
        focus++;
    }
    if(equation[focus].charAt(0) == ' ')
        equation[focus] = "";
    equation[focus] += character;
    updateCurrentCalculation(false);
}

function appendCharForEvaluation(character) {
    if((focus + 1) % 2 === 0) {
        equation.push("");
        focus++;
    }
    if(equation[focus].charAt(0) == ' ')
        equation[focus] = "";
    equation[focus] += character;
    
    updateCurrentCalculation(true);
}

function popChar() {
    if(clearAll)
        clearEverything();
    else {
        if(equation[focus].length > 0)
            equation[focus] = equation[focus].substring(0, equation[focus].length - 1);
        else
            equation[focus] = "";
        updateCurrentCalculation(false);
    }
}

function operation(character) {
    clearAll = false;
    
    if(focus % 2 === 0) {
        equation.push(character);
        focus++;
    } else {
        equation[focus] = character;
    }
    
    updateCurrentCalculation(false);
    
    if(character === "=") {
        modalShow = true;
        $("#resultBaseDialog").modal();
    }
}

function continueEvaluation() {
    evaluate(document.getElementById("resultBase").value);
    modalShow = false;
    clearAll = true;
}

function clearEverything() {
    var currentCalc = document.getElementsByClassName("currentCalculation");
    
    while(focus > 0) {
        document.getElementById("calc-" + focus).parentNode.removeChild(document.getElementById("calc-"+focus));
        equation.pop();
        focus--;
    }
    
    equation[focus] = " ";
    
    clearAll = false;
    
    updateCurrentCalculation(false);
}

function updateCurrentCalculation(updateToModalBase) {
    var currentCalc = document.getElementById("staging-area");
    if(currentCalc.childElementCount - 1 <= focus) {
        var row = document.createElement("div");
        row.className="currentCalculation row";
        row.id="calc-"+focus;
        
        var next = document.createElement("div");
        next.className="col-sm-9";
        
        var text = document.createElement("p");
        text.className="text-right padding";
        
        next.appendChild(text);
        row.appendChild(next);
        
        var base = document.createElement("div");
        base.className="col-sm-3";
        base.id="base-calc-"+focus;
        
        if(focus % 2 === 0) {
            text.className="text-right shaded";
            var form_group = document.getElementsByClassName("form-group")[0].cloneNode(true);
            if(updateToModalBase) {
                form_group.firstElementChild.value = document.getElementById("resultBase").value;
            }
            base.appendChild(form_group);
        }
        
        row.appendChild(base);
        currentCalc.appendChild(row);
    }
    
    if(equation[focus].length > 0) {
        document.getElementById("calc-"+focus).firstElementChild.firstElementChild.innerHTML = equation[focus];
    } else {
        if(focus > 0) {
            document.getElementById("calc-" + focus).parentNode.removeChild(document.getElementById("calc-"+focus));
            equation.pop();
            focus--;
        } else if (focus === 0)
            document.getElementById("calc-"+focus).firstElementChild.firstElementChild.innerHTML = equation[focus];
    }
}

function keyUp(event) {
    //console.log(event.keyCode);
    if(!modalShow) {
        if(!event.shiftKey) {
            if(event.keyCode >= 48 && event.keyCode <= 57)
                appendChar(String.fromCharCode(event.keyCode));
            else if(event.keyCode == 189)
                operation('-');
            else if (event.keyCode == 191)
                operation('/');
            else if (event.keyCode == 187)
                operation('=');
        }
        else if (event.shiftKey) {
            if(event.keyCode == 187)
                operation('+');
            else if (event.keyCode == 56)
                operation('*');
        }
        if(event.keyCode >= 65 && event.keyCode <= 90)
            appendChar(String.fromCharCode(event.keyCode));
        else if(event.keyCode == 8)
            popChar();
        else if(event.keyCode == 13)
            evaluate();
        else if(event.keyCode == 27)
            clearEverything();
    }
}

function evaluate(resultBase) {
    var offset = 0;
    var valid = true;
    var numbers = [];
    for(var i = 0; i <= focus; i++) {
        var current = document.getElementById("calc-"+i);
        if(i % 2 === 0) {
            var base = current.getElementsByClassName("form-control")[0].value;
            if(equation[i].length <= 0) {
                valid = false;
                alert("There is no number here!");
                break;
            }
            for(var x = 0; x < equation[i].length; x++) {
                var number = equation[i].charCodeAt(x) - 48 <= 9 ? equation[i].charCodeAt(x) - 48 : equation[i].charCodeAt(x) - 55;
                if(number >= base) {
                    alert("The number in position " + (i-offset) + " is not valid for this base. This number needs to be at least base " + (number + 1) + ". Please change before attempting to evaluate!");
                    valid = false;
                    break;
                }
            }
            if(valid) {
                numbers.push(toBaseTen(equation[i], base));
            }
        } else {
            offset++;
            numbers.push(equation[i]);
        }
    }
    
    if(valid) {
        var equationString = "";
        
        for(var i = 0; i < numbers.length - 1; i++) {
            equationString+=numbers[i];
        }
        
        while(equationString.indexOf('=') != -1){
            equationString = equationString.substring(equationString.indexOf('=') + 1);
        }
        
        var evaluated = eval(equationString.toString());
        evaluated = backToBase(evaluated, resultBase);
        for(var i = 0; i < evaluated.length; i++) {
            appendCharForEvaluation(evaluated.charAt(i));
        }
    }
}

function toBaseTen(numString, base) {
    var num1Arr = [];
    var num1Negative = false;

    for(var i = numString.length - 1, index = 0; i >= 0; i--, index++) {
        if(numString.charCodeAt(i) >= 48 && numString.charCodeAt(i) <= 57)
            num1Arr.push(numString.charCodeAt(i) - 48);
        else if(numString.charCodeAt(i) > 64 && numString.charCodeAt(i) < 91)
            num1Arr.push(numString.charCodeAt(i) - 55);
        else
            console.log("Invalid Character. Passing over...");
    }
    
    var numBaseTen = 0;
    var placeValue = 1;
    
    for (i = 0; i < num1Arr.length; i++) {
        numBaseTen += num1Arr[i] * placeValue;
        placeValue *= base;
    }
    
    return numBaseTen;
}

function backToBase(result, base) {
    var resultNegative = false;
    
    if(result < 0) {
        result *= -1;
        resultNegative = true;
    }
    
    var resultBaseString = "";
    while(result >= 1) {
        if(result % base < 10)
            resultBaseString = String.fromCharCode(result % base + 48) + resultBaseString;
        else
            resultBaseString = String.fromCharCode(result % base + 55) + resultBaseString;
        result /= base;
    }
    
    if(resultNegative)
        resultBaseString = "-" + resultBaseString;
    
    return resultBaseString;
}
