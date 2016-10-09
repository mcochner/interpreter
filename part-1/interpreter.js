/**
 * Created by martin on 10/9/16.
 */

// will run unit tests
TEST_ENABLE = true;
//TEST_ENABLE = false;

// triedy
// Token,
//
// Interpreter: metody:
//   - get_next_token - Lexikalny analyzer
//   - expr - parser
//   - eat  - iba porovna, ci sa zhoduje typ

INTEGER ='INTEGER';
PLUS = 'PLUS';
EOF = 'EOF';
WHITESPACE='WHITESPACE';
ARITHMETIC_OPERATOR = 'ARITHMETIC_OPERATOR';
INTEGER='INTEGER';
PLUS='PLUS';
EOF='EOF';
WHITESPACE='WHITESPACE';
ARITHMETIC_OPERATOR='ARITHMETIC_OPERATOR';

function print(s){
    console.log(s);
}


function Token(type, value){
    this.type = type;
    this.value = value;

    this.str = function str(){
        return "Token(" + this.type + ", " + this.value + ")"
    };

    this.print = function print(){
        console.log(this.str())
    }
}

(function testToken(){
    if (TEST_ENABLE){
    var t1 = new Token("integer", 4);
    var t2 = new Token("operator", "*");
    assert(4, t1.value);
    assert("operator", t2.type);
    //t1.print();
    //t2.print();
    print("testToken passed.");
    }
})();

function assert(real, expected){
    if (real !== expected){
        throw new Error("Test failed. " + real + " != " + expected)
    }
}

function isSpace(s){
    return s.trim() === '';
}

(function isSpaceTest(){
    if (TEST_ENABLE){
    assert(isSpace("  "), true);
    assert(isSpace("  something"), false);
    print("isSpaceTest passed.");
    }
})();

function isDigit(s){
    return /^\d$/.test(s);
}

(function isDigitTest(){
    if (TEST_ENABLE){
        assert(isDigit("3"), true);
        assert(isDigit("33"), false);
        assert(isDigit("s2"), false);
        assert(isDigit("0"), true);
        print("isDigitTest passed.");
    }
})();


function Interpreter(text){
    this.text = text;
    this.pos = 0;
    this.currentToken = null;

    this.error = function(){
        throw new Error("Error parsing input");
    };

    //Lexical analyzor

    this.getNextToken = function getNextToken(){
        var text = this.text;
        this.pos;

        if (this.pos > text.length -1){
            return new Token(EOF, null);
        }

        var currentChar = text[this.pos];

        while (isSpace(currentChar)){
            this.pos += 1;
            currentChar = text[this.pos];
        }

        if (isDigit(currentChar)){
            var multiCharInteger = this.getIntegerAsString(text, this.pos);
            print ("current_int: " + multiCharInteger);
            var token = new Token(INTEGER, parseInt(multiCharInteger));
            this.pos += multiCharInteger.length;
            return token;
        }

        if (currentChar === "+" || currentChar === "-"){
            var token = new Token(ARITHMETIC_OPERATOR, currentChar);
            this.pos += 1;
            return token;

        }

        this.error();

    };

    this.getIntegerAsString = function getIntegerAsString(text, pos){
        var result = "";
        if (pos === undefined){
            throw new Error("pos is undefined");
        }
        var s = text[pos];
        while ( isDigit(s) ){
            result += s;
            if (pos > text.length-1 ){
                return result;
            }
            pos += 1;
            s = text[pos];
            //print(s);
        }
        return result
    };

    this.eat = function eat(tokenType){
        if (this.currentToken.type == tokenType){
            this.currentToken = this.getNextToken();
        } else {
            this.error();
        }
    };

    // Interpreter
    this.expr = function expr(){

        // INTEGER PLUS INTEGER
        this.currentToken = this.getNextToken();


        var left = this.currentToken;
        this.eat(INTEGER);

        var op = this.currentToken;
        this.eat(ARITHMETIC_OPERATOR);

        var right = this.currentToken;
        this.eat(INTEGER);
        //print ("left: " +left.value + ", op: " + op.value + ", right: "+ right.value);
        var result;
        if (op.value == "+"){
            result = left.value + right.value;
            return result;
        }

        if (op.value == "-"){
            result = left.value - right.value;
            return result;
        }

        if (op.value == "*"){
            result = left.value * right.value;
            return result;
        }

        if (op.value == "/"){
            result = left.value / right.value;
            return result;
        }

        this.error();
    }
}

(function getIntegerAsStringTest(){
    if (TEST_ENABLE){
        assert( new Interpreter("Something").getIntegerAsString("1ak", 0), "1");
        assert( new Interpreter("Something").getIntegerAsString("hi", 0), "");
        assert( new Interpreter("Something").getIntegerAsString("hello45", 5), "45");
        assert( new Interpreter("Something").getIntegerAsString("hello45", 6), "5");
        print("getIntegerAsStringTest passed.");
    }
})();


(function main(){
    var sampleInput = "32 + 12";
    print("Sample input: " + sampleInput );
    var interpreter = new Interpreter(sampleInput);
    print (interpreter.expr());
})();