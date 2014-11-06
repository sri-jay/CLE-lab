%{
	#include "y.tab.h"
	#include <stdlib.h>
	extern int yylval;

%}
%%
[_a-zA-Z][_a-zA-Z0-9]* {return ID;}
[0-9]+	{
		yylval = atoi(yytext);
		return NUM;
  	}
.	{return yytext[0];}
\n {return 0;}
%%

