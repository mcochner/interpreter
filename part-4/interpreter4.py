# Token types
#
# EOF (end-of-file) token is used to indicate that
# there is no more input left for lexical analysis
INTEGER, PLUS, EOF, WHITESPACE, ARITHMETIC_OPERATOR = 'INTEGER', 'PLUS', 'EOF', 'WHITESPACE', 'ARITHMETIC_OPERATOR'


class Token(object):
    def __init__(self, type, value):
        # token type: INTEGER, PLUS, or EOF
        self.type = type
        # token value: 0, 1, 2. 3, 4, 5, 6, 7, 8, 9, '+', or None
        self.value = value

    def __str__(self):
        """String representation of the class instance.

        Examples:
            Token(INTEGER, 3)
            Token(PLUS '+')
        """
        return 'Token({type}, {value})'.format(
            type=self.type,
            value=repr(self.value)
        )

    def __repr__(self):
        return self.__str__()


class Interpreter(object):
    def __init__(self, text):
        # client string input, e.g. "3+5"
        self.text = text
        # self.pos is an index into self.text
        self.pos = 0
        # current token instance
        self.current_token = None

    def error(self):
        raise Exception('Error parsing input')


    # Lexikalny analyzator - vracia tokeny
    def get_next_token(self):
        """Lexical analyzer (also known as scanner or tokenizer)

        This method is responsible for breaking a sentence
        apart into tokens. One token at a time.
        """
        text = self.text

        # is self.pos index past the end of the self.text ?
        # if so, then return EOF token because there is no more
        # input left to convert into tokens
        if self.pos > len(text) - 1:
            return Token(EOF, None)

        # get a character at the position self.pos and decide
        # what token to create based on the single character
        current_char = text[self.pos]

        while current_char.isspace():
            self.pos += 1
            current_char = text[self.pos]

        # if the character is a digit then convert it to
        # integer, create an INTEGER token, increment self.pos
        # index to point to the next character after the digit,
        # and return the INTEGER token

        if current_char.isdigit():
            # begin Excercise 1: adding multiple-digit integers

            multichar_integer = self.get_integer_as_string(text[self.pos:])

            print("current_int: ", multichar_integer)

            token = Token(INTEGER, int(multichar_integer))
            self.pos += len(multichar_integer)
            return token

        if current_char == '+' or current_char == '-' or current_char == '*' or current_char == '/':
            token = Token(ARITHMETIC_OPERATOR, current_char)
            self.pos += 1
            return token

        self.error()

    def get_integer_as_string(self, text):
        #print "input_text= ##", text, "##"
        # this method will return an integer
        result = ""
        for i in range(0, len(text)):
            #print i, " ", text, " , ",  len(text)
            if text[i].isdigit():
                result += text[i]
                #print "if_true_result = ", result
            else:
                #print "returning_result = ", result
                return result

        return result

    def eat(self, token_type):
        # compare the current token type with the passed token
        # type and if they match then "eat" the current token
        # and assign the next token to the self.current_token,
        # otherwise raise an exception.
        if self.current_token.type == token_type:
            self.current_token = self.get_next_token()
        else:
            self.error()

    # Parser
    #
    #   - 1. Zistuje CO sa ma urobit
    #   - 2. Vykonava instrukcie

    def expr(self):
        """expr -> INTEGER PLUS INTEGER"""
        # set current token to the first token taken from the input
        self.current_token = self.get_next_token()

        # we expect the current token to be a single-digit integer
        left = self.current_token
        self.eat(INTEGER)

        result = left.value
        # now we expect a nonzero number of Arithmetic_operator and integer
        while self.current_token.type != EOF:

            # we expect the current token to be a '+' token
            op = self.current_token
            self.eat(ARITHMETIC_OPERATOR)

            # we expect the current token to be a single-digit integer
            right = self.current_token
            self.eat(INTEGER)

            # after the above call the self.current_token is set to
            # EOF token

            # at this point INTEGER PLUS INTEGER sequence of tokens
            # has been successfully found and the method can just
            # return the result of adding two integers, thus
            # effectively interpreting client input

            # Parsing je hotovy, zacina interpretor
            if op.value == "+":
                result = result + right.value

            if op.value == "-":
                result = result - right.value

            if op.value == "*":
                #raise Exception("Not Supported")
                result = result * right.value

            if op.value == "/":
                #raise Exception("Not Supported")
                result = result / right.value

        return result


def main():
    while True:
        try:
            # To run under Python3 replace 'raw_input' call
            # with 'input'
            text = raw_input('calc> ')
        except EOFError:
            break
        if not text:
            continue
        interpreter = Interpreter(text)
        result = interpreter.expr()
        print(result)


if __name__ == '__main__':
    main()
