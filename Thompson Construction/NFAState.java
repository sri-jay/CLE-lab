package com.company;

import java.util.*;

class NFAState
{
    private int state;
    private List<StateTransition> transition = new ArrayList<StateTransition>();
    public int transitions;

    NFAState(int statenumber)
    {
        state = statenumber;
        transition.add(new StateTransition());
        transition.add(new StateTransition());
        transitions = 2;
    }

    int GetState() {
        return state;
    }

    void SetTransition(NFAState nfState,char trans,int n) {
        transition.get(n).SetTransitionTarget(nfState,trans);
    }

    NFAState GetTransition()
    {
        return transition.get(0).GetTransition();
    }

    StateTransition GetStateTransition()
    {
        return transition.get(0);
    }
    void PrintNFAData()
    {
        Character symbol = transition.get(0).GetSymbol();
        if(symbol == '~')
            System.out.println("->("+state+")");
        else
            System.out.print("->("+state+")"+"-"+symbol);
    }
    List<StateTransition> GetStateTransitionsAsList()
    {
        return new ArrayList<StateTransition>(transition);
    }
}