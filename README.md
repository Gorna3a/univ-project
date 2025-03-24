# univ-project
 
things to do :
- i need to create the landing page for my website containing an app review and features
- create a login and sign up pages so with that i would add a new components file

important things to know (features to be added):
     *The AI hint system:
     the way this would work is that when a user is solving a puzzle or a task he could ask for help or a hint
     + it should also be able to fix errors 

[chatGPT vision of how could ai work in my app  (optional but very good if we manage to make it)

     AI can assist in several ways:
     Generate Hints : Analyze the problem and user code to provide context-aware hints.
     Explain Solutions : Break down complex solutions into simple, step-by-step explanations.
     Debug Code : Identify errors in the user’s code and suggest fixes.
     Answer Questions : Allow users to ask questions about programming concepts or errors, and get instant answers.]



     *The user experiance :
     first :
    the user somehow just spawned and decided to learn java and went to check our website 
    then the user is faced with our landing page , then he gets to sign up (get started) and then be moved to the sign up page , in case the user already have an account he can directly login.

     second : 
     => User Authentication
     if the user tries to sign up he is prompted to enter his userName , full name (optional) , gmail , passWord , knowledgeLevel (noob, pro)
     if the user tries to login in he is prompted to enter his userName or gmail and his password.

    second:
    after that the user will be redirected to the courses page 
     => the knowledge level would be able to help determine the tasks that the user should go throught (for example the pro programer would have much harder puzzles and tasks to solve then the noob one)
     soo the generated tasks would be differant.
               => to do so i would create a standard templates for each puzzle and then modify or adjust the difficulty based on the knowledgeLevel (just the questions and things needed) without needing to create each puzzles for each type(noob , pro).
               => another idea i found is to track the user's progress over time and dynamically adjust the difficulty of tasks based on their performance(optional).

    page generation:
    noob : Focus on syntax, basic concepts, and simple problem-solving.
    pro : Include algorithmic challenges, optimization problems.
    