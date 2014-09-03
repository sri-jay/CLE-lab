package com.company;
import java.io.*;


public class Main
{
    public static void main(String args[]) throws Exception
    {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String exp = reader.readLine();
        String[] st = extract(exp);
    }

    public static String[] extract(String expr)
    {
        NFA n = new NFA();
        int start = 0;
        int end = expr.length();

        for(int i=0;i<end;i++)
        {
            n.AddNewState(expr.charAt(i));
        }
        n.SetFinalState();
        System.out.println();
        n.PrintNFA();
        return new String[1];
    }
}

class NFA
{
    private NFAState StartState;
    private int StateCount;
    private NFAState FinalState;

    NFA()
    {
        StateCount = 0;
        StartState = new NFAState(-666);
        FinalState = new NFAState(666);
    }
    void AddNewState(char sym)
    {
        if(StateCount == 0)
            AddStartState();

        NFAState newstate = StartState;
        while(true)
        {
            if(newstate.GetTransition() != null)
                newstate = newstate.GetTransition();
            else
                break;
        }
        newstate.SetTransition(new NFAState(++StateCount),sym);

    }

    void AddStartState()
    {
        NFAState newstate = StartState;
        newstate.SetTransition(new NFAState(++StateCount),'E');
    }

    void SetFinalState()
    {
        NFAState newstate = StartState;
        while(true)
        {
            if(newstate.GetTransition() != null)
                newstate = newstate.GetTransition();
            else
                break;
        }
        newstate.SetTransition(FinalState,'E');
    }
    void PrintNFA()
    {
        NFAState newstate = StartState;
        while(newstate != null)
        {
                newstate.PrintNFAData();
                newstate = newstate.GetTransition();
        }
    }
}

class NFAState
{
    private int state;
    private StateTransition transition;

    NFAState(int _state)
    {
        state = _state;
        transition = new StateTransition();
    }

    Integer GetState()
    {
        return state;
    }
    void SetTransition(NFAState nfState,char trans)
    {
        transition.SetTransitionTarget(nfState,trans);
    }
    NFAState GetTransition()
    {
        return transition.GetTransition();
    }

    void PrintNFAData()
    {
        Character symbol = transition.GetSymbol();
        if(symbol == '~')
            System.out.println("->("+state+")");
        else
            System.out.print("->("+state+")"+"-"+symbol);
    }
}

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
}