package com.nfautomaton;

class StateTransition
{
    private Character symbol;
    private NFAState target;

    StateTransition()
    {
        symbol = null;
        target = null;
    }

    void setTransitionTarget(NFAState nfs,char sym)
    {
        symbol = sym;
        target = nfs;
    }
    char getSymbol()
    {
        if(symbol == null)
            return '~';
        else
            return symbol;
    }
    NFAState getTransition()
    {
        return target;
    }

    int getTransitionTarget()
    {
        if(target == null)
            return -1;
        else
            return target.getState();
    }
}