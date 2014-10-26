package com.company;

class StateTransition
{
    private Character symbol;
    private NFAState target;

    StateTransition()
    {
        symbol = null;
        target = null;
    }

    void SetTransitionTarget(NFAState nfs,char sym)
    {
        symbol = sym;
        target = nfs;
    }
    char GetSymbol()
    {
        if(symbol == null)
            return '~';
        else
            return symbol;
    }
    NFAState GetTransition()
    {
        return target;
    }

    int GetTransitionTarget()
    {
        if(target == null)
            return -1;
        else
            return target.GetState();
    }
}