import java.io.*;
import java.util.*;

/*
prefix, suffix proper suffix substring
*/
class main
{
	public static void main(String args[]) throws Exception
	{
		BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
		
		System.out.println("Enter a string.");

		String str = reader.readLine();
		Set<String> data = new LinkedHashSet<String>();
	
		for(int i=0;i<=str.length();i++)
			data.add(str.substring(0,i));
		
		System.out.println("Prefixes");
		for(String x : data)
			System.out.println(x);

		System.out.println();
		data.clear();


		for(int i=str.length();i >= 0;i--)
			data.add(str.substring(i,str.length()));

		System.out.println("Suffixes");
		for(String x : data)
			System.out.println(x);
		System.out.println();

		System.out.println("Proper Suffixes");
		data.remove("");
		data.remove(str);
		for(String x : data)
			System.out.println(x);
		System.out.println();
		data.clear();

		System.out.println("Substrings");

		for(int i=0;i<=str.length();i++)
		{
			for(int j=i;j<=str.length();j++)
			{
				System.out.println(str.substring(i,j));
			}
		}


	}
}


/** 
 *  Enter a string.
 *  MPTYBRNS
 *  Prefixes
 *  
 *  M
 *  MP
 *  MPT
 *  MPTY
 *  MPTYB
 *  MPTYBR
 *  MPTYBRN
 *  MPTYBRNS
 *  
 *  Suffixes
 *  
 *  S
 *  NS
 *  RNS
 *  BRNS
 *  YBRNS
 *  TYBRNS
 *  PTYBRNS
 *  MPTYBRNS
 *  
 *  Proper Suffixes
 *  S
 *  NS
 *  RNS
 *  BRNS
 *  YBRNS
 *  TYBRNS
 *  PTYBRNS
 *  
 *  Substrings
 *  
 *  M
 *  MP
 *  MPT
 *  MPTY
 *  MPTYB
 *  MPTYBR
 *  MPTYBRN
 *  MPTYBRNS
 *  
 *  P
 *  PT
 *  PTY
 *  PTYB
 *  PTYBR
 *  PTYBRN
 *  PTYBRNS
 *  
 *  T
 *  TY
 *  TYB
 *  TYBR
 *  TYBRN
 *  TYBRNS
 *  
 *  Y
 *  YB
 *  YBR
 *  YBRN
 *  YBRNS
 *  
 *  B
 *  BR
 *  BRN
 *  BRNS
 *  
 *  R
 *  RN
 *  RNS
 *  
 *  N
 *  NS
 *  
 *  S
 */