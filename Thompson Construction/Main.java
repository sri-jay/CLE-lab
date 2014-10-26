package com.company;

import java.io.*;

class Main
{
    public static void main(String args[]) throws Exception
    {
        NFAutomaton n = new NFAutomaton();
        RegularExpression r = new RegularExpression("(a+b)*(c+d)");
        r.toPostFix();
        System.out.println(r.getPostfix());
        n.ParseExpression("ab+cd+.*");
        n.test();
    }
}

