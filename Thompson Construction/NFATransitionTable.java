package com.nfautomaton;
import java.util.*;

/* *
 * Represents a generic transition table.
 * All transitions are represented as strings.
 * Each transition is of the form :
 *  CurrentState-Symbol-TargetState
 *  */
public class NFATransitionTable
{

    private Set<String> coretable;
    private boolean tablevalidity;
    private static NFAState traveller = null;

    NFATransitionTable(NFAState st)
    {
        tablevalidity = false;
        coretable = new TreeSet<String>();
        traveller = st;
        updateTable();
    }

    /**
     * Builds the transition table recursively.
     * */
    void transitionTableRecursiveBuild(NFAState traveller,Set<String> table)
    {
        List<StateTransition> transitions = traveller.getStateTransitionsAsList();
        for(StateTransition st : transitions)
        {
            if(st.getSymbol() != '~' && !table.contains(traveller.getState() + "  " + Character.toString(st.getSymbol()) + "  " + Integer.toString(st.getTransitionTarget()))){
                table.add(traveller.getState() + "  " + Character.toString(st.getSymbol()) + "  " + Integer.toString(st.getTransitionTarget()));
            }
            else
                return;

            if(st.getTransition() != null){
                transitionTableRecursiveBuild(st.getTransition(),table);
            }
        }
        return;
    }

    void updateTable()
    {
        transitionTableRecursiveBuild(traveller,coretable);
        tablevalidity = true;
    }

    void invalidateTable()
    {
        tablevalidity = false;
    }

    Set<String> getTransitionTable()
    {
        if(!tablevalidity)
            updateTable();

        return coretable;
    }
}
