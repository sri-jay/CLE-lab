%{
	#include <stdio.h>
	#include <stdlib.h>
%}
%token NUM ID
%left '+''-'
%left '*''/'
%nonassoc UMINUS
%%
S:EXP {printf("The result is %d\n",$$);}
;
EXP:EXP'+'EXP  
		{$$ = $1 + $3;}
    |EXP'-'EXP 	
		{$$ = $1 - $3;}
	|EXP'/'EXP 	
		{$$ = $1 / $3;}
	|EXP'*'EXP
		{$$ = $1 * $3;}
	|'-'EXP %prec UMINUS
		{$$ = -$2;}
	|'('EXP')'
		{$$ = $2;}
	|NUM
		{$$ = $1;}
	|ID
;
%%
int main()
{
	printf("Enter an expression");
	yyparse();
	printf("Valid Expression");
	return 0;
}
yyerror(char *s)
{
	printf("Invalid Expression");
	exit(0);
}
