import java.io.*;
import java.util.*;

class language 
{
	Set<String> strings = new LinkedHashSet<String>();
	String languageName;

	language(String langName)
	{
		languageName = langName;

		try{
			getLang();
		}

		catch(IOException ioex)
		{
			ioex.printStackTrace();
		}
		printLang();
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
	public static void main(String[] args) throws Exception{
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

		System.out.println("Creating 2 languages");
		language a = new language("Language a");
		language b = new language("Language b");

		getIntersection(a.strings,b.strings);
		getUnion(a.strings,b.strings);

	}
	public static void getIntersection(Set<String> langa,Set<String> langb)
	{
		Set<String> intersection = new HashSet<String>(langa);
		intersection.retainAll(langb);

		System.out.println("Set Intersection : ");
		for(String x : intersection)
			System.out.println(x);
	}

	public static void getUnion(Set<String> langa,Set<String> langb)
	{		
		Set<String> union = new LinkedHashSet<String>(langa);
		for(String x : langb)
			union.add(x);

		System.out.println("Set Union : ");
		for(String x : union)
			System.out.println(x);
	}
}

/**
 * Creating 2 languages
 * Enter your language as a string
 * B A T
 * Language a
 * B
 * A
 * T
 * Enter your language as a string
 * M A N
 * Language b
 * M
 * A
 * N
 * Set Intersection :
 * A
 * Set Union :
 * B
 * A
 * T
 * M
 * N
*/