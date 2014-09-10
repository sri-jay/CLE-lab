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
	public static void main(String[] args) throws Exception {
		
		Language a = new Language("Language A");
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		a.getLang();
		System.out.println("Calculating Closures");

		System.out.println("Enter a limit.");
		int limit = Integer.parseInt(reader.readLine());

		System.out.println("* or +?");
		String data = reader.readLine();
		char closureMode = data.charAt(0);
		Language closure = languageClosure(a,limit-1,closureMode);
		closure.printLang();
		
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
	public static Language languageClosure(Language langa,int closureLimit,char lambda)
	{
		Language temp = new Language("Closure of "+langa.languageName);
		Language closure = new Language("Closure of "+langa.languageName);

		temp.strings= new LinkedHashSet<String>(langa.strings);
		closure.strings = new LinkedHashSet<String>(langa.strings);
		for(int i=0;i<closureLimit;i++)
		{
			temp = languageConcat(langa,temp);
			closure.strings = returnUnion(closure.strings,temp.strings);
		}
		closure.languageName = "Closure of "+langa.languageName;
		if(lambda == '*'){
			closure.addString("~");
		}
		return closure;
	}

	public static Set returnUnion(Set<String> langa,Set<String> langb)
	{		
		Set<String> union = new LinkedHashSet<String>(langa);
		for(String x : langb)
			union.add(x);

		return union;
	}
}

/**
* Enter your language as a string
* S A M
* Calculating Closures
* Enter a limit.
* 2
* * or +?
* +
* Closure of Language A
* S
* A
* M
* SS
* AS
* MS
* SA
* AA
* MA
* SM
* AM
* MM
 */