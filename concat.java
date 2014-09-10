import java.io.*;
import java.util.*;

class Language 
{
	Set<String> strings = new LinkedHashSet<String>();
	String languageName;

	Language(String langName)
	{
		languageName = langName;
	}

	void addString(String str)
	{
		strings.add(str);
	}
	void getLang() throws IOException
	{
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		System.out.println("Enter your language as a string");
		String[] dataAsString = reader.readLine().split(" ");
		for(String str : dataAsString)
			strings.add(str);
	}

	void printLang()
	{
		System.out.println(languageName);
		for(String x : strings)
		{
			System.out.println(x);
		}
	}
}

class main
{
	public static void main(String[] args) {
		
		Language a = new Language("Language A");
		Language b = new Language("Language B");
		try{
			a.getLang();
			System.out.println();	
			b.getLang();
		}
		catch(IOException ioe)
		{

		}
		System.out.println();
		Language c = languageConcat(a,b);
		c.printLang();
	}
	public static Language languageConcat(Language langa,Language langb)
	{
		Language concatedLang = new Language(langa.languageName+"+"+langb.languageName);
		for(String aString : langa.strings)
		{
			for(String bString : langb.strings){
				concatedLang.addString(bString+aString);
			}
		}
		return concatedLang;
	}
}

/**
 * Enter your language as a string
 *	A B
 *
 *	Enter your language as a string
 *	C D
 *
 *	Language A+Language B
 *	CA
 *	DA
 *	CB
 *	DB	
*/