package com.nfautomaton;

import java.util.*;

/**
* Holds necessary functions and variables needed to represent a
 * NFA.
 * */
class NFAutomaton
{
    private final Character LAMBDA = 'λ';
    /*Holds the number of States in the NFA
    * */
    private int StateCount;

    /*Start state holds reference to  StartState of NFA
    * StartState has state = -666*/
    private NFAState StartState ;

    /*FinalState holds the FinalState of the NFA.
    * FinalState has state = 666*/
    private NFAState FinalState;

    /* Holds the transition table of the NFA
    * */
    private NFATransitionTable TransitionTable;

    /**
     * Loads and holds the regular expression.
     */
    private RegularExpression regExp;

    NFAutomaton()
    {
        StateCount = 0;
        StartState = new NFAState(-666);
        FinalState = new NFAState(666);
        TransitionTable = new NFATransitionTable(StartState);
    }

    void loadRegularExpression(String re)
    {
        regExp = new RegularExpression(re);
        regExp.infixToPostfix();
    }

    void destroyAutomaton()
    {
        this.StartState = null;
        this.FinalState = null;
        System.gc();
    }

    NFATransitionPair thompsonUnion(NFATransitionPair transA,NFATransitionPair transB)
    {
        NFAState branchOut = new NFAState(StateCount++);
        NFAState branchIn = new NFAState(StateCount++);

        branchOut.setTransition(transA.getRef(NFATransitionPair.HEAD), LAMBDA, 0);
        branchOut.setTransition(transB.getRef(NFATransitionPair.HEAD), LAMBDA, 1);

        transA.getRef(NFATransitionPair.TAIL).setTransition(branchIn, LAMBDA, 0);
        transB.getRef(NFATransitionPair.TAIL).setTransition(branchIn, LAMBDA, 0);

        return new NFATransitionPair(branchOut,branchIn,false);
    }

    NFATransitionPair thompsonConcatenation(NFATransitionPair transA,NFATransitionPair transB)
    {
        NFATransitionPair andPair = null;
        if(transB.isPrimitive)
        {
            NFAState transATail = transA.getRef(NFATransitionPair.TAIL);
            NFAState transBTail = transB.getRef(NFATransitionPair.TAIL);
            NFAState transBHead = transB.getRef(NFATransitionPair.HEAD);

            Character sym = transBHead.getStateTransition().getSymbol();

            transATail.setTransition(transBTail, sym, 0);

            andPair = new NFATransitionPair(transA.getRef(NFATransitionPair.HEAD),transBTail,false);
        }
        else
        {
            transA.getRef(NFATransitionPair.TAIL).setTransition(transB.getRef(NFATransitionPair.HEAD), LAMBDA, 0);
            andPair = new NFATransitionPair(transA.getRef(NFATransitionPair.HEAD), transB.getRef(NFATransitionPair.TAIL), false);
        }

        return andPair;
    }

    NFATransitionPair kleeneStar(NFATransitionPair trans)
    {
        NFAState outerA = new NFAState(StateCount++);
        NFAState outerB = new NFAState(StateCount++);

        outerA.setTransition(outerB, LAMBDA, 1);
        outerA.setTransition(trans.getRef(NFATransitionPair.HEAD), LAMBDA, 0);

        trans.getRef(NFATransitionPair.TAIL).setTransition(trans.getRef(NFATransitionPair.HEAD), LAMBDA, 0);
        trans.getRef(NFATransitionPair.TAIL).setTransition(outerB, LAMBDA, 1);

        return new NFATransitionPair(outerA,outerB,false);
    }

    NFATransitionPair kleenePlus(NFATransitionPair trans)
    {
        trans.getRef(NFATransitionPair.TAIL).setTransition(trans.getRef(NFATransitionPair.HEAD),LAMBDA,0);
        return trans;
    }

    NFATransitionPair zeroOrOneOccurrence(NFATransitionPair trans)
    {
        NFAState outerA = new NFAState(StateCount++);
        NFAState outerB = new NFAState(StateCount++);

        outerA.setTransition(trans.getRef(NFATransitionPair.HEAD),LAMBDA,0);
        outerA.setTransition(outerB,LAMBDA,1);
        trans.getRef(NFATransitionPair.TAIL).setTransition(outerB,LAMBDA,0);

        return new NFATransitionPair(outerA,outerB,false);
    }

    void parseExpression()
    {
        String expression = regExp.toString();
        Stack<Object> stk = new Stack<Object>();

        for(int i=0;i<expression.length();i++)
        {
            Character sym = expression.charAt(i);
            if(Character.isLetter(sym))
            {
                NFAState start = new NFAState(StateCount++);
                NFAState end = new NFAState(StateCount++);

                start.setTransition(end, sym, 0);

                stk.push(new NFATransitionPair(start,end,true));
            }
            else
            {
                if(sym.equals('*'))
                {
                    NFATransitionPair result = kleeneStar((NFATransitionPair) stk.pop());
                    stk.push(result);
                }
                else if(sym.equals('+'))
                {
                    NFATransitionPair result = kleenePlus((NFATransitionPair) stk.pop());
                    stk.push(result);
                }
                else if(sym.equals('?'))
                {
                    NFATransitionPair result = zeroOrOneOccurrence((NFATransitionPair) stk.pop());
                    stk.push(result);
                }
                else if(sym.equals('|'))
                {
                    NFATransitionPair branchOne = (NFATransitionPair) stk.pop();
                    NFATransitionPair branchTwo = (NFATransitionPair) stk.pop();

                    stk.push(thompsonUnion(branchTwo, branchOne));
                }
                else if(sym.equals('.'))
                {
                    NFATransitionPair branchOne = (NFATransitionPair) stk.pop();
                    NFATransitionPair branchTwo = (NFATransitionPair) stk.pop();

                    stk.push(thompsonConcatenation(branchTwo, branchOne));
                }
            }
        }

        NFATransitionPair nfa = (NFATransitionPair) stk.pop();

        StartState.setTransition(nfa.getRef(NFATransitionPair.HEAD), LAMBDA, 0);
        nfa.getRef(NFATransitionPair.TAIL).setTransition(FinalState, LAMBDA, 0);

        TransitionTable = new NFATransitionTable(StartState);
        TransitionTable.invalidateTable();
        TransitionTable.updateTable();
    }

    void printTransitionTable()
    {
        StringBuilder output = new StringBuilder();
        Set<String> table = TransitionTable.getTransitionTable();

        for(String str : table){
            output.append(str);
            output.append('\n');
        }

        System.out.println(output.toString());
    }

}