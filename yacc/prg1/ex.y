%{
	#include <stdio.h>
	#include <stdlib.h>
%}
%token num
%% 
E:E'+'T
 |E'-'T
 |T
 ;
T:T'*'F
 |T'/'F
 |F
 ;
F:num
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
