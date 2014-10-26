package com.company;

public class NFATransitionPair
{
    public NFAState head = null;
    public NFAState tail = null;
    public boolean isPrimitive;

    NFATransitionPair(NFAState headRef,NFAState tailRef,boolean isPrimitive)
    {
        head = headRef;
        tail = tailRef;
        this.isPrimitive = isPrimitive;
    }

    NFAState getRef(String option)
    {
        NFAState ref = null;
        if(option.equals("head"))
            return head;

        if(option.equals("tail"))
            return tail;

        return new NFAState(-666);
    }
}
