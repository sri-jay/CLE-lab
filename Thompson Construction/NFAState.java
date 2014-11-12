package com.nfautomaton;

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

    int getState() {
        return state;
    }

    void setTransition(NFAState nfState,char trans,int n) {
        transition.get(n).setTransitionTarget(nfState, trans);
    }

    NFAState getTransition()
    {
        return transition.get(0).getTransition();
    }

    StateTransition getStateTransition()
    {
        return transition.get(0);
    }
    void grintNFAData()
    {
        Character symbol = transition.get(0).getSymbol();
        if(symbol == '~')
            System.out.println("->("+state+")");
        else
            System.out.print("->("+state+")"+"-"+symbol);
    }
    List<StateTransition> getStateTransitionsAsList()
    {
        return new ArrayList<StateTransition>(transition);
    }
}