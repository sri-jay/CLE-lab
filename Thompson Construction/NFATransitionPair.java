package com.nfautomaton;

public class NFATransitionPair
{
    public NFAState head = null;
    public NFAState tail = null;
    public boolean isPrimitive;
    public static final String HEAD = "head";
    public static final String TAIL = "tail";

    NFATransitionPair(NFAState headRef,NFAState tailRef,boolean isPrimitive)
    {
        head = headRef;
        tail = tailRef;
        this.isPrimitive = isPrimitive;
    }

    NFAState getRef(String option)
    {
        NFAState ref = null;
        if(option.equals(HEAD))
            return head;

        if(option.equals(TAIL))
            return tail;

        return new NFAState(-666);
    }
}
