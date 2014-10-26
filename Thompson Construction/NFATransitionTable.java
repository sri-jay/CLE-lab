package com.company;
import java.util.*;

/* *
 * Represents a generic transition table.
 * All transitions are represented as strings.
 * Each transition is of the form :
 *  CurrentState-Symbol-TargetState
 *  */
public class NFATransitionTable {

    private Set<String> coretable;
    private boolean tablevalidity;
    private static NFAState traveller = null;

    NFATransitionTable(NFAState st)
    {
        tablevalidity = false;
        coretable = new TreeSet<String>();
        traveller = st;
        System.out.println("Created TransitionTable");
        UpdateTable();
    }

    /**
     * Builds the transition table recursively.
     * */
    void TransitionTableRecursiveBuild(NFAState traveller,Set<String> table) {
        List<StateTransition> transitions = traveller.GetStateTransitionsAsList();
        for(StateTransition st : transitions)
        {
            if(st.GetSymbol() != '~' && !table.contains(traveller.GetState() + "  " + Character.toString(st.GetSymbol()) + "  " + Integer.toString(st.GetTransitionTarget()))){
                table.add(traveller.GetState() + "  " + Character.toString(st.GetSymbol()) + "  " + Integer.toString(st.GetTransitionTarget()));
            }
            else
                return;

            if(st.GetTransition() != null){
                TransitionTableRecursiveBuild(st.GetTransition(),table);
            }
        }
        return;
    }

    void UpdateTable() {
        TransitionTableRecursiveBuild(traveller,coretable);
        tablevalidity = true;
    }

    void InvalidateTable()
    {
        tablevalidity = false;
    }

    Set<String> GetTransitionTable()
    {
        if(!tablevalidity)
            UpdateTable();

        return coretable;
    }
}
