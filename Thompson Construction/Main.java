package com.nfautomaton;

class Main
{
    public static void main(String args[]) throws Exception
    {
        String r = "(a|b|c)?";
        RegularExpression re = new RegularExpression(r);
        System.out.println(re.toString());

        NFAutomaton n = new NFAutomaton();
        n.loadRegularExpression(r);
        n.parseExpression();
        n.printTransitionTable();
    }
}

