package com.company;

import java.util.Stack;

public class RegularExpression {

    private String infixRegularExpression;
    private String postfixRegularExpression;

    public RegularExpression(String infixStr)
    {
        infixRegularExpression = infixStr;
    }

    public String getPostfix()
    {
        return postfixRegularExpression;
    }
    public void toPostFix()
    {
        Stack<Character> oprStack = new Stack<Character>();
        StringBuffer buf = new StringBuffer(infixRegularExpression.length());

        for(int i=0;i<infixRegularExpression.length();i++)
        {
            char str = (infixRegularExpression.charAt(i));
            if(valueOfOpr(str) == 0)
            {
                buf.append(str);

                if(i != infixRegularExpression.length()-1 && !oprStack.isEmpty())
                {
                    char nextChar = (infixRegularExpression.charAt(i+1));
                    char opStack = oprStack.peek();

                    int compare =  compareOperators (opStack,nextChar);

                    if(compare >0 && valueOfOpr(opStack) != 5)
                    {
                        opStack = oprStack.pop();
                        buf.append(opStack);
                    }
                }
            }

            if(i == infixRegularExpression.length()-1)
            {
                if(valueOfOpr(str) > 0 && valueOfOpr(str) != 4)
                    throw new RuntimeException("Invalid Expression");

                while(!oprStack.isEmpty())
                {
                    char temp = oprStack.pop();
                    if(valueOfOpr(temp) != 3)
                        buf.append(temp);
                }
            }
            else if (valueOfOpr(str) > 0)
            {

                if(oprStack.isEmpty())
                    oprStack.push(str);

                else
                {

                    if(valueOfOpr(str) == 4)
                    {
                        while(!oprStack.isEmpty())
                        {
                            char temp = oprStack.pop();

                            if(valueOfOpr(temp) != 3)
                                buf.append(temp);
                        }
                    }
                    else
                    {
                        char opStack = oprStack.pop();
                        int compare =  compareOperators (opStack,str);

                        if(compare >0)
                        {
                            oprStack.push(str);
                            oprStack.push(opStack);
                        }
                        else
                        {
                            oprStack.push(opStack);
                            oprStack.push(str);
                        }
                    }
                }
            }
        }

        postfixRegularExpression = buf.toString();
        System.out.println("Postifx regular expression: "+postfixRegularExpression);
    }


    public int compareOperators(char op1 , char op2)
    {
        return valueOfOpr( op1) - valueOfOpr( op2) ;
    }


    public int valueOfOpr(char op){
        int value = 0;

        if(op == '*')
            value = 2;
        if(op == '+')
            value = 1;
        if(op == '.')
            value = 1;
        if(op == '(')
            value = 3;
        if(op == ')')
            value = 4;

        return value;
    }
}