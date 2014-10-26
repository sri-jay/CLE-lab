class State:
	"""
		Create a instance ot this class to represent a state of the NFA.
	"""
	def __init__(self,state_number):
		self.links = {}
		self.state_number = state_number

	def print_self(self):
		"""
			Print the state number/label.
		"""
		return self.state_number

	def add_link(self,target,symbol):
		"""
			Adds a reference from current state to specified target state using the transition symbol 'symbol'
		"""
		print " # @ state : ",self.state_number,"\n  # Linked to : ",target.state_number," on symbol:",symbol
		self.links[symbol] = target

class NFA:
	"""
		Create an NFA as an object of this class
	"""

	def __init__(self):
		self.states = {}

	def create_and_add_states(self, statedata=None):
		"""
			Creates and adds one or more states, delimited by a comma.
				-Does not add previously existing states.
		"""
		if statedata == None:
			print "Wrong usage, enter command as: addr a,b,c,d....."
			return 

		for i in statedata.split(","):
			if not i in self.states:
				self.states[i] = State(i)
				print " # Added State : ",i
			else:
				print " # State already present : ",i

	def add_link(self,arguments=None):
		"""
			Creates a link betwwen 2 states using a specified symbol.
		"""
		if arguments == None:
			print " #   Specify an argument!"
			return
		else:
			arguments = arguments.split(",")
			if len(arguments) == 3:
				if arguments[0] in self.states and arguments[1] in self.states:
					self.states[arguments[0]].add_link(target=self.states[arguments[1]],symbol=arguments[2])
				else:
					print " #  REQUIRED STATES DO NOT EXIST"
					return
			else:
				print " #  WRONG ARGUMENTS "
				return 

	def print_transition_table(self):
		"""
			Prints the transition table of the current NFA.
		"""
		print "\n---START-TRANSITION-TABLE---\n"
		for state,object in self.states.iteritems():
			print "     ",state," :"

			for symbol,target in object.links.iteritems(): 
				print "      ",symbol," -> ",target.state_number
		print "\n---END-TRANSITION-TABLE---\n"

	def help(self):
		"""
			Prints a help message.
		"""
		print " COMMAND ttable\n     Prints the transition table of the NFA.\n"
		print " COMMAND add state1,state2,state3...stateN\n     Adds a list of states to the NFA,\n     add more than one state by specifiying with a comma.\n     Will not create copies of states.\n"
		print " COMMAND link stateA,stateB,T\n     Creates a directed link from stateA to stateB with symbol T.Reports warning if states do not exist.\n"
		print " COMMAND load filename.nfs\n     Loads script from specified file and executes it."
		print " UTILITY help\n     Prints this help message.\n"
		print " UTILITY exit\n     Terminates program.\n"

	def parse_code_from_file(self,filename):
		functions = {
			"ttable" : self.print_transition_table,
			"add" : self.create_and_add_states,
			"link" : self.add_link,
			"help" : self.help
		}

		reader = open(filename,"r")

		print "Running Script : ",filename,"\n"
		for command in reader:
			comm = command.strip().split(" ")
			if comm[0] == "exit" or comm[0] == "END":
				break
			if comm[0] in functions:
				if len(comm) == 2:
					functions[comm[0]](comm[1])
				else:
					functions[comm[0]]()

		print "\nDone."

	def script(self):
		"""
			Launches a "Shell" to run commands on the NFA.
		"""
		functions = {
			"ttable" : self.print_transition_table,
			"add" : self.create_and_add_states,
			"link" : self.add_link,
			"load" : self.parse_code_from_file,
			"help" : self.help
		}
		while True:
			command  = raw_input("$> ").split(" ")
			if command[0] == "exit":
				break
			if command[0] in functions:
				if len(command) == 2:
					functions[command[0]](command[1])
				else:
					functions[command[0]]()


if __name__ == "__main__":
	automaton = NFA()
	automaton.help()
	automaton.script()