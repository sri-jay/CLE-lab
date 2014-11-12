package com.nfautomaton;
import java.util.*;

public class RegularExpression {

    /** Operators precedence map. */
    private static final Map<Character, Integer> precedenceMap;

    // Strings that hold the regular expression
    private String infixRegExp;
    private String postfixRegExp;

    // Some constants to enhance code readability
    public static  final String INFIX_REGEXP = "REF_INFIX_REGEXP";
    public static final String POSTFIX_REGEXP = "REF_POSTFIX_REGEXP";

    static
    {
        Map<Character, Integer> map = new HashMap<Character, Integer>();
        map.put('(', 1);
        map.put('|', 2);
        map.put('.', 3); // explicit concatenation operator
        map.put('?', 4);
        map.put('*', 4);
        map.put('+', 4);
        map.put('^', 5);
        precedenceMap = Collections.unmodifiableMap(map);
    };

    RegularExpression(String regExp)
    {
        infixRegExp = regExp;
        postfixRegExp = null;
        infixToPostfix();
    }

    /**
     * Returns the postfix expression
     * @return postFixRegExp
     */
    public String getRegExp(String returnOption)
    {
        String regExp = null;
        if(returnOption.equals(INFIX_REGEXP))
            regExp = new String(infixRegExp);
        if(returnOption.equals(POSTFIX_REGEXP))
            regExp = new String(postfixRegExp);

        return regExp;
    }

    @Override
    public String toString()
    {
        if(postfixRegExp == null)
            infixToPostfix();

        return getRegExp(POSTFIX_REGEXP);
    }

    /**
     * Get character precedence.
     *
     * @param c character
     * @return corresponding precedence
     */
    private static Integer getPrecedence(Character c)
    {
        Integer precedence = precedenceMap.get(c);
        return precedence == null ? 6 : precedence;
    }

    /**
     * Transform regular expression by inserting a '.' as explicit concatenation
     * operator.
     */
    private static String formatRegEx(String regex)
    {
        StringBuilder res = new StringBuilder();
        List<Character> allOperators = Arrays.asList('|', '?', '+', '*', '^');
        List<Character> binaryOperators = Arrays.asList('^', '|');

        for (int i = 0; i < regex.length(); i++) {
            Character c1 = regex.charAt(i);

            if (i + 1 < regex.length()) {
                Character c2 = regex.charAt(i + 1);

                res.append(c1);

                if (!c1.equals('(') && !c2.equals(')') && !allOperators.contains(c2) && !binaryOperators.contains(c1)) {
                    res.append('.');
                }
            }
        }
        res.append(regex.charAt(regex.length() - 1));

        return res.toString();
    }

    /**
     * Convert regular expression from infix to postfix notation using
     * Shunting-yard algorithm.
     *
     * @return postfix notation
     */
    public void infixToPostfix()
    {
        StringBuilder postfix = new StringBuilder();

        Stack<Character> stack = new Stack<Character>();

        String formattedRegEx = formatRegEx(infixRegExp);

        for (Character c : formattedRegEx.toCharArray()) {
            switch (c) {
                case '(':
                    stack.push(c);
                    break;

                case ')':
                    while (!stack.peek().equals('(')) {
                        postfix.append(stack.pop());
                    }
                    stack.pop();
                    break;

                default:
                    while (stack.size() > 0) {
                        Character peekedChar = stack.peek();

                        Integer peekedCharPrecedence = getPrecedence(peekedChar);
                        Integer currentCharPrecedence = getPrecedence(c);

                        if (peekedCharPrecedence >= currentCharPrecedence) {
                            postfix.append(stack.pop());
                        } else {
                            break;
                        }
                    }
                    stack.push(c);
                    break;
            }

        }

        while (stack.size() > 0)
            postfix.append(stack.pop());

        postfixRegExp = postfix.toString();
    }
}