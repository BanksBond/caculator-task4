// App.js
import React, { useState } from "react";
import { Textfit } from "react-textfit";

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const math = (a, b, sign) =>
  sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

const zeroDivisionError = "Can't divide with 0";

export default function App() {
  const [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
    expression: "",
  });

  function resetClickHandler() {
    setCalc({
      sign: "",
      num: 0,
      res: 0,
      expression: "",
    });
  }

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        expression: calc.expression + value,
        num:
          removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
            ? toLocaleString(Number(removeSpaces(calc.num + value)))
            : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const comaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      expression: calc.expression + value,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const compareSignExpresion = (expression, sign) =>{
    const lastelement = expression?.slice(-1);
    
    let reg = new RegExp('^[0-9]$');
    const result =  (lastelement === '+' || lastelement === '-' || lastelement === 'X' || lastelement === '/') ? (expression.slice(0, -1 ) + sign) : expression + sign
    return result;
  }

  const signClickHandler = (e) => {
    
    setCalc({
      ...calc,
      expression: compareSignExpresion(calc.expression, e.target.innerHTML),
      sign: e.target.innerHTML,
      res: !calc.num
        ? calc.res
        : !calc.res
        ? calc.num
        : toLocaleString(
            math(
              Number(removeSpaces(calc.res)),
              Number(removeSpaces(calc.num)),
              calc.sign
            )
          ),
      num: 0,
    });
  };

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? zeroDivisionError
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  calc.sign
                )
              ),
        expression: "",
        sign: "",
        num: 0,
      });
    }
  };

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      expression: calc.expression + "(+-)",
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;
    setCalc({
      ...calc,
      expression: compareSignExpresion(calc.expression, "%"),
      num: (num * 10 ** 16) / 10 ** 18,
      res: (res * 10 ** 16) / 10 ** 18,
      sign: "",
    });
  };

  const buttonClickHandler = (e, btn) => {
    btn === "C" || calc.res === zeroDivisionError
      ? resetClickHandler()
      : btn === "+-"
      ? invertClickHandler()
      : btn === "%"
      ? percentClickHandler()
      : btn === "="
      ? equalsClickHandler()
      : btn === "/" || btn === "X" || btn === "-" || btn === "+"
      ? signClickHandler(e)
      : btn === "."
      ? comaClickHandler(e)
      : numClickHandler(e);
  };

  const removeBrackers =(express) =>{

    express = express.replace('(', '');
    express = express.replace(')', '');

    return express;
  }
  return (
    <>
      <Wrapper>
        <Screen
          value={calc.num ? calc.num : calc.res}
          expression={removeBrackers(calc.expression) }
        />
        <ButtonBox>
          {btnValues.flat().map((btn, i) => {
            return (
              <Button
                key={i}
                className={
                  btn === "="
                    ? "equals cgreen"
                    : i === 0
                    ? "cgreen"
                    : typeof btn === "string"
                    ? "operators"
                    : ""
                }
                value={btn}
                onClick={(e) => buttonClickHandler(e, btn)}
              />
            );
          })}
        </ButtonBox>
      </Wrapper>
      <Footer />
    </>
  );
}

function Wrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}

function Screen({ value, expression }) {
  return (
    <>
      <span className="exscreen">{expression}</span>
      <Textfit className="screen" mode="single" max={70}>
        {value}
      </Textfit>
    </>
  );
}

function ButtonBox({ children }) {
  return <div className="buttonBox">{children}</div>;
}

function Button({ className, value, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

function Footer() {
  return (
    <footer>
      <p>© 2024 Bakhtyar Ansari aka BanksBond</p>
    </footer>
  );
}
