echo "Running command : yacc -d ex.y";
yacc -d ex.y;
echo "Running command : lex lex1.l";
lex lex1.l;
echo "Compling parser : gcc -o lex.yy.c y.tab.c parser -ll";
gcc -o parser lex.yy.c y.tab.c -ll;
echo "Run ./parser";
sleep 0.5;
clear;
./parser;
rm ./parser
rm lex.yy.c;
rm y.tab.*;
