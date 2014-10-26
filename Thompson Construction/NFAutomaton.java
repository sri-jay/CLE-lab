package com.company;

import java.util.*;

/**
* Holds necessary functions and variables needed to represent a
 * NFA.
 * */
class NFAutomaton
{
    /*Holds the number of States in the NFA
    * */
    private int StateCount;

    /*Start state holds reference to  StartState of NFA
    * StartState has state = -666*/
    private NFAState StartState;

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

    NFAutomaton() {
        StateCount = 0;
        StartState = new NFAState(-666);
        FinalState = new NFAState(666);
        TransitionTable = new NFATransitionTable(StartState);
    }

    NFATransitionPair ThompsonOR(NFATransitionPair transA,NFATransitionPair transB)
    {
        NFAState branchOut = new NFAState(StateCount++);
        NFAState branchIn = new NFAState(StateCount++);

        branchOut.SetTransition(transA.getRef("head"),'λ',0);
        branchOut.SetTransition(transB.getRef("head"),'λ',1);

        transA.getRef("tail").SetTransition(branchIn,'λ',0);
        transB.getRef("tail").SetTransition(branchIn,'λ',0);

        TransitionTable.InvalidateTable();
        return new NFATransitionPair(branchOut,branchIn,false);
    }

    NFATransitionPair ThompsonAND(NFATransitionPair transA,NFATransitionPair transB)
    {
        NFATransitionPair andPair = null;
        if(transB.isPrimitive)
        {
            NFAState transATail = transA.getRef("tail");
            NFAState transBTail = transB.getRef("tail");
            NFAState transBHead = transB.getRef("head");

            Character sym = transBHead.GetStateTransition().GetSymbol();

            transATail.SetTransition(transBTail,sym,0);

            //transBHead = null;
            TransitionTable.InvalidateTable();
            andPair = new NFATransitionPair(transA.getRef("head"),transBTail,false);
        }
        else
        {
            transA.getRef("tail").SetTransition(transB.getRef("head"),'λ',0);
            andPair = new NFATransitionPair(transA.getRef("head"), transB.getRef("tail"), false);
        }

        return andPair;
    }

    NFATransitionPair KleeneStar(NFATransitionPair trans)
    {
        NFAState outerA = new NFAState(StateCount++);
        NFAState outerB = new NFAState(StateCount++);

        outerA.SetTransition(outerB,'λ',1);
        outerA.SetTransition(trans.getRef("head"),'λ',0);

        trans.getRef("tail").SetTransition(trans.getRef("head"),'λ',0);
        trans.getRef("tail").SetTransition(outerB,'λ',1);

        TransitionTable.InvalidateTable();
        return new NFATransitionPair(outerA,outerB,false);
    }

    void ParseExpression(String expression)
    {
        Stack<Object> stk = new Stack<Object>();

        for(int i=0;i<expression.length();i++)
        {
            Character sym = expression.charAt(i);
            if(Character.isLetter(sym))
            {
                NFAState start = new NFAState(StateCount++);
                NFAState end = new NFAState(StateCount++);

                start.SetTransition(end,sym,0);

                stk.push(new NFATransitionPair(start,end,true));
            }
            else
            {
                if(sym.equals('*'))
                {
                    NFATransitionPair result = KleeneStar((NFATransitionPair) stk.pop());
                    stk.push(result);
                }
                else if(sym.equals('+'))
                {
                    System.out.println("Encountered +, Stack : " + stk.size());
                    NFATransitionPair branchOne = (NFATransitionPair) stk.pop();
                    NFATransitionPair branchTwo = (NFATransitionPair) stk.pop();

                    stk.push(ThompsonOR(branchTwo,branchOne));
                }
                else if(sym.equals('.'))
                {
                    System.out.println("Encountered . , Stack : " + stk.size());
                    NFATransitionPair branchOne = (NFATransitionPair) stk.pop();
                    NFATransitionPair branchTwo = (NFATransitionPair) stk.pop();

                    stk.push(ThompsonAND(branchTwo,branchOne));
                }
            }
        }

        NFATransitionPair nfa = (NFATransitionPair) stk.pop();
        StartState.SetTransition(nfa.getRef("head"),'λ',0);
        nfa.getRef("tail").SetTransition(FinalState,'λ',0);

        TransitionTable = new NFATransitionTable(StartState);
        TransitionTable.InvalidateTable();
        TransitionTable.UpdateTable();
    }


    void test()
    {
        if(TransitionTable == null)
            System.out.println("Nll");

        Set<String> table = TransitionTable.GetTransitionTable();

        for(String st : table)
            System.out.println(st);
    }

}